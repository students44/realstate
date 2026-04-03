import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import Link from "next/link";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { revalidatePath } from "next/cache";
import AdminPropertyFilter from "@/components/admin/AdminPropertyFilter"; // New client component

export default async function AdminPropertiesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const { status: filterStatus } = await searchParams;
  await dbConnect();
  
  // Build query based on filter
  let query: any = {};
  if (filterStatus && filterStatus !== "all") {
    query.status = filterStatus;
  }

  // Fetch properties (sorting pending first, then by date)
  // Custom sort: pending > approved > rejected
  const properties = await Property.find(query)
    .populate("owner", "name email")
    .lean();

  // Manual sort to ensure pending is always first regardless of alphabets
  const sortedProperties = properties.sort((a: any, b: any) => {
    const order: any = { pending: 0, approved: 1, rejected: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3) || 
           new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
  });

  // Server actions for managing properties
  async function approveProperty(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await dbConnect();
    await Property.findByIdAndUpdate(id, { status: "approved" });
    revalidatePath("/admin/properties");
  }

  async function rejectProperty(formData: FormData) {
    "use server";
    const id = formData.get("id");
    await dbConnect();
    await Property.findByIdAndUpdate(id, { status: "rejected" });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">Manage Properties</h1>
          <p className="text-foreground/60 text-lg font-medium">Verify or moderate platform listings.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter (Client Component) */}
          <AdminPropertyFilter />
          
          <Link href="/dashboard/properties/add" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap">
            Add New
          </Link>
        </div>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-[2rem] overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 text-foreground/40 border-b border-foreground/10 text-[10px] uppercase font-black tracking-widest">
                <th className="p-6">Property / Type</th>
                <th className="p-6">Owner</th>
                <th className="p-6">Pricing</th>
                <th className="p-6">Current Status</th>
                <th className="p-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5 font-medium">
              {sortedProperties.map((property: any) => (
                <tr key={property._id.toString()} className="hover:bg-foreground/5 transition-colors group">
                  <td className="p-6">
                    <Link href={`/properties/${property.slug}`} className="font-bold text-foreground hover:text-blue-500 transition-colors block mb-0.5">
                      {property.title}
                    </Link>
                    <span className="text-xs text-foreground/30 font-bold uppercase tracking-tighter">{property.propertyType} • {property.purpose}</span>
                  </td>
                  <td className="p-6">
                    <span className="block truncate max-w-[150px] font-bold text-foreground/70">{property.owner?.name || "Unknown"}</span>
                    <span className="text-xs text-foreground/30">{property.owner?.email}</span>
                  </td>
                  <td className="p-6 font-black text-foreground">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      property.status === "approved" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      property.status === "pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       {property.status === "pending" && (
                         <>
                           <form action={approveProperty}>
                             <input type="hidden" name="id" value={property._id.toString()} />
                             <button type="submit" className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Approve">
                               <FiCheckCircle size={18} />
                             </button>
                           </form>
                           <form action={rejectProperty}>
                             <input type="hidden" name="id" value={property._id.toString()} />
                             <button type="submit" className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Reject">
                               <FiXCircle size={18} />
                             </button>
                           </form>
                         </>
                       )}
                       
                       <Link href={`/dashboard/properties/edit/${property._id}`} className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Edit">
                         <FiEdit size={18} />
                       </Link>

                       <form action={deleteProperty}>
                         <input type="hidden" name="id" value={property._id.toString()} />
                         <button type="submit" className="p-3 bg-red-500/5 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all cursor-pointer" title="Delete">
                           <FiTrash2 size={18} />
                         </button>
                       </form>
                    </div>
                  </td>
                </tr>
              ))}
              
              {sortedProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center font-bold text-foreground/20">
                    No results for this selection.
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

