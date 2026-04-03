import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ wishlist: [] });
  }

  try {
    await dbConnect();
    const user = await User.findById(session.user.id).select("wishlist").lean();
    return NextResponse.json({ wishlist: user?.wishlist?.map((id: any) => id.toString()) || [] });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure wishlist exists
    if (!user.wishlist) user.wishlist = [];

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    const index = user.wishlist.findIndex((id: any) => id.toString() === propertyId);

    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(propertyObjectId);
    }

    await user.save();
    return NextResponse.json({ 
      wishlist: user.wishlist.map((id: any) => id.toString()),
      isSaved: index === -1 
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
