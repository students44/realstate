import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminEditForm from "./AdminEditForm";
import { Types } from "mongoose";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Validate ObjectID to prevent crash
  if (!Types.ObjectId.isValid(id)) {
      return <div className="p-8 text-center text-red-500">Invalid Property ID</div>
  }

  await dbConnect();
  
  const property = await Property.findById(id).lean();

  if (!property) {
    return <div className="p-8 text-center font-bold">Property not found!</div>;
  }

  // Convert ObjectIDs to string for passing to Client Component
  property._id = property._id.toString();
  property.owner = property.owner.toString();
  
  // Verify ownership
  if (property.owner !== session.user.id && session.user.role !== "admin") {
      return <div className="p-8 text-center text-red-500 font-bold">Forbidden! You don't own this property.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Edit Listing</h1>
        <p className="text-foreground/60">Update details for: <span className="font-bold text-blue-500">{property.title}</span></p>
      </div>

      <AdminEditForm initialData={JSON.parse(JSON.stringify(property))} />
    </div>
  );
}
