import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import Link from "next/link";
import { FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { revalidatePath } from "next/cache";

export default async function AdminPropertiesPage() {
  await dbConnect();
  
  // Fetch properties (sorting pending first, then by date)
  const properties = await Property.find({})
    .sort({ status: -1, createdAt: -1 })
    .populate("owner", "name email");

  // Server actions for managing properties
  async function approveProperty(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await dbConnect();
    await Property.findByIdAndUpdate(id, { status: "approved" });
    revalidatePath("/admin/properties");
  }

  async function deleteProperty(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await dbConnect();
    await Property.findByIdAndDelete(id);
    revalidatePath("/admin/properties");
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Manage Properties</h1>
          <p className="text-foreground/60">Approve, edit, or delete listings.</p>
        </div>
        <Link href="/dashboard/properties/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add Property
        </Link>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/10 text-foreground/80 border-b border-foreground/10">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 text-foreground/80">
              {properties.map((property) => (
                <tr key={property._id.toString()} className="hover:bg-foreground/5 transition-colors">
                  <td className="p-4">
                    <Link href={`/properties/${property.slug}`} className="font-semibold text-blue-500 hover:text-blue-600 line-clamp-1">
                      {property.title}
                    </Link>
                    <span className="text-xs text-foreground/50">{property.propertyType} - {property.purpose}</span>
                  </td>
                  <td className="p-4">
                    <span className="block truncate max-w-[150px]">{property.owner?.name || "Unknown"}</span>
                  </td>
                  <td className="p-4 font-medium">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      property.status === "approved" ? "bg-green-500/10 text-green-500" :
                      property.status === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {property.status === "pending" && (
                         <form action={approveProperty}>
                           <input type="hidden" name="id" value={property._id.toString()} />
                           <button type="submit" className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve">
                             <FiCheckCircle size={18} />
                           </button>
                         </form>
                       )}
                       
                       <Link href={`/dashboard/properties/edit/${property._id}`} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                         <FiEdit size={18} />
                       </Link>

                       <form action={deleteProperty}>
                         <input type="hidden" name="id" value={property._id.toString()} />
                         <button type="submit" className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete" onClick={(e) => !confirm("Are you sure?") && e.preventDefault()}>
                           <FiTrash2 size={18} />
                         </button>
                       </form>
                    </div>
                  </td>
                </tr>
              ))}
              
              {properties.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
