import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";

export default async function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  await dbConnect();
  
  // Extract simple filters
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const purpose = typeof searchParams.purpose === 'string' ? searchParams.purpose : undefined;

  let query: any = { status: "approved" };
  if (type && type !== "all") query.propertyType = type;
  if (purpose && purpose !== "all") query.purpose = purpose;

  const rawProperties = await Property.find(query).sort({ createdAt: -1 }).lean();
  
  // Convert _id ObjectIDs to string for client passing
  const properties = rawProperties.map(p => ({
     ...p,
     _id: String(p._id),
     owner: String(p.owner)
  }));

  return (
    <div className="min-h-[80vh] bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Discover Properties</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Explore our curated selection of premium real estate. Use the filters to find exactly what you're looking for.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <PropertyFilters />
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-foreground/70 font-medium">{properties.length} Properties found</span>
              <select className="px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-sm focus:outline-none focus:border-blue-500">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {properties.length > 0 ? properties.map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              )) : (
                <div className="col-span-full py-20 text-center text-foreground/50 text-lg">
                   No properties found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
