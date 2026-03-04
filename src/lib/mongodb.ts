import { MongoClient } from "mongodb";
import dns from "dns";

// Bypass local DNS issues by using both Google and Cloudflare public DNS resolvers
// This helps resolve SRV records needed for MongoDB Atlas SRV connection strings
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);

// Force IPv4 to avoid IPv6 DNS resolution issues
dns.setDefaultResultOrder('ipv4first');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Trust";
// Derive DB name from the connection string path if present, otherwise allow override via DB_NAME env or default to 'test'
let DB_NAME = process.env.DB_NAME || '';
try {
  if (!DB_NAME) {
    const m = MONGODB_URI.match(/mongodb(?:\+srv)?:\/\/[^/]+\/(?<db>[^?]+)/);
    if (m && m.groups && m.groups.db) {
      DB_NAME = decodeURIComponent(m.groups.db);
    } else {
      DB_NAME = 'test';
    }
  }
} catch (e) {
  DB_NAME = DB_NAME || 'test';
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: "majority"
    });
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.error("Connection string:", MONGODB_URI.substring(0, 50) + "...");
    throw error;
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db(DB_NAME);
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
