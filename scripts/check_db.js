const { MongoClient } = require('mongodb');
const fs = require('fs');

function readEnv(path = '.env.local'){
  try{
    const txt = fs.readFileSync(path,'utf8');
    const lines = txt.split(/\r?\n/);
    const obj = {};
    for(const line of lines){
      const m=line.match(/^\s*([^#=]+)=([\s\S]*)$/);
      if(m){ obj[m[1].trim()]=m[2].trim(); }
    }
    return obj;
  }catch(e){
    console.error('Could not read .env.local:',e.message);
    return {};
  }
}

(async ()=>{
  const env = readEnv();
  const uri = env.MONGODB_URI;
  if(!uri){
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('Using MONGODB_URI:', uri.length>80?uri.slice(0,80)+'...':uri);
  const DB_NAME = 'Trust';

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try{
    await client.connect();
    console.log('Connected to server');
    const db = client.db(DB_NAME);
    const cols = await db.listCollections().toArray();
    console.log('Collections in', DB_NAME, cols.map(c=>c.name));

    const names = ['donors','messages','subscribers','volunteers'];
    for(const name of names){
      try{
        const col = db.collection(name);
        const count = await col.countDocuments();
        const sample = await col.findOne();
        console.log(`\nCollection: ${name}`);
        console.log('  count=',count);
        console.log('  sample=', sample ? JSON.stringify(sample).slice(0,200) + (JSON.stringify(sample).length>200?'...':'') : 'null');
      }catch(e){
        console.log(`  error accessing ${name}:`, e.message);
      }
    }

    // Also list dbs (if permitted)
    try{
      const admin = client.db().admin();
      const dbs = await admin.listDatabases();
      console.log('\nDatabases visible on server:', dbs.databases.map(d=>d.name));
    }catch(e){
      console.log('Could not list all databases:', e.message);
    }

    await client.close();
    process.exit(0);
  }catch(err){
    console.error('Connection error:', err.message);
    process.exit(2);
  }
})();