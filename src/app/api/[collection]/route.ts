import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const coll = await getCollection(collection);
    const docs = await coll.find({}).toArray();
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const body = await request.json();
    const coll = await getCollection(collection);

    const result = await coll.insertOne(body);
    return NextResponse.json(
      { _id: result.insertedId, ...body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
