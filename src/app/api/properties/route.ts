import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const purpose = searchParams.get("purpose");
    const status = searchParams.get("status") || "approved"; 
    // Filter out unapproved mappings for public end unless explicitly requested by admin
    
    // Check if admin is requesting all statuses
    const session = await auth();
    let query: any = { status };
    if (session?.user?.role === "admin" && searchParams.has("status")) {
       query.status = searchParams.get("status");
    }

    if (type && type !== "all") query.propertyType = type;
    if (purpose && purpose !== "all") query.purpose = purpose;

    await dbConnect();

    const properties = await Property.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await dbConnect();

    // Check slug uniqueness
    let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let existing = await Property.findOne({ slug });
    if (existing) {
       slug = `${slug}-${Date.now()}`;
    }

    const newProperty = new Property({
      ...data,
      slug,
      owner: session.user.id,
      status: session.user.role === "admin" ? "approved" : "pending"
    });

    await newProperty.save();

    return NextResponse.json({ message: "Property created successfully", property: newProperty }, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
