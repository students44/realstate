import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { auth } from "@/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const property = await Property.findById(params.id);
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    return NextResponse.json({ property }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const property = await Property.findById(params.id);
    
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    if (property.owner.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData = await req.json();
    
    const updatedProperty = await Property.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json({ message: "Property updated successfully", property: updatedProperty }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const property = await Property.findById(params.id);
    
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    if (property.owner.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Property.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Property deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
