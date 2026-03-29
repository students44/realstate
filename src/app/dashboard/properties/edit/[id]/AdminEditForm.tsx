"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminEditForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    price: initialData.price || "",
    propertyType: initialData.propertyType || "house",
    purpose: initialData.purpose || "buy",
    bedrooms: initialData.bedrooms || "",
    bathrooms: initialData.bathrooms || "",
    area: initialData.area || "",
    areaUnit: initialData.areaUnit || "sqft",
    "location.address": initialData.location?.address || "",
    "location.city": initialData.location?.city || "",
    images: initialData.images ? initialData.images.join(", ") : "",
    features: initialData.features ? initialData.features.join(", ") : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataPayload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        area: Number(formData.area),
        areaUnit: formData.areaUnit,
        location: {
          address: formData["location.address"],
          city: formData["location.city"],
        },
        images: formData.images ? formData.images.split(",").map((i: string) => i.trim()).filter(Boolean) : [],
        features: formData.features ? formData.features.split(",").map((f: string) => f.trim()).filter(Boolean) : [],
      };

      const res = await fetch(`/api/properties/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPayload),
      });

      if (res.ok) {
        toast.success("Property updated successfully!");
        router.push("/admin/properties");
        router.refresh();
      } else {
         const errData = await res.json();
         toast.error(errData.error || "Failed to update property");
      }
    } catch (error) {
       toast.error("An error occurred");
    } finally {
       setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-foreground/5 p-6 md:p-8 border border-foreground/10 rounded-2xl">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                     <option value="house">House</option>
                     <option value="apartment">Apartment</option>
                     <option value="plot">Plot</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Purpose</label>
                  <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                     <option value="buy">For Sale</option>
                     <option value="rent">For Rent</option>
                  </select>
               </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input required name="price" type="number" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>
             </div>
          </div>
        </div>

        {/* Details & Specifications */}
        <div className="space-y-4 pt-6 border-t border-foreground/10">
          <h2 className="text-xl font-bold">Details & Specs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
             <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" min="0" />
             </div>
             <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" min="0" />
             </div>
             <div>
                  <label className="block text-sm font-medium mb-1">Area Size *</label>
                  <input required name="area" type="number" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" min="1"  />
             </div>
             <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select name="areaUnit" value={formData.areaUnit} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                     <option value="sqft">Sq Ft</option>
                     <option value="marla">Marla</option>
                  </select>
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
            <input name="features" value={formData.features} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 pt-6 border-t border-foreground/10">
          <h2 className="text-xl font-bold">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input required name="location.address" value={formData["location.address"]} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input required name="location.city" value={formData["location.city"]} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4 pt-6 border-t border-foreground/10">
          <h2 className="text-xl font-bold">Images (Mock integration)</h2>
          <div>
             <label className="block text-sm font-medium mb-1">Direct Image URLs (comma separated)</label>
             <textarea name="images" value={formData.images} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-foreground/20 bg-background focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"></textarea>
          </div>
        </div>

        <div className="pt-6 border-t border-foreground/10 flex justify-end gap-4">
           <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold border border-foreground/20 hover:bg-foreground/5 transition-colors">
             Cancel
           </button>
           <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors disabled:opacity-50">
             {loading ? "Updating..." : "Update Property"}
           </button>
        </div>
      </form>
  );
}
