import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await dbConnect();
  
  // Await searchParams in Next.js 15
  const resolvedParams = await searchParams;
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;
  const purpose = typeof resolvedParams.purpose === 'string' ? resolvedParams.purpose : undefined;
  const location = typeof resolvedParams.location === 'string' ? resolvedParams.location : undefined;
  const minPrice = parseInt(typeof resolvedParams.minPrice === 'string' ? resolvedParams.minPrice : "0");
  const maxPrice = parseInt(typeof resolvedParams.maxPrice === 'string' ? resolvedParams.maxPrice : "0");
  const bedrooms = parseInt(typeof resolvedParams.bedrooms === 'string' ? resolvedParams.bedrooms : "0");
  const bathrooms = parseInt(typeof resolvedParams.bathrooms === 'string' ? resolvedParams.bathrooms : "0");

  let query: any = { status: "approved" };
  if (type && type !== "all") query.propertyType = type;
  if (purpose && purpose !== "all") query.purpose = purpose;
  
  // Price range filter
  if (minPrice > 0 || maxPrice > 0) {
    query.price = {};
    if (minPrice > 0) query.price.$gte = minPrice;
    if (maxPrice > 0) query.price.$lte = maxPrice;
  }

  // Bed/Bath filter
  if (bedrooms > 0) query.bedrooms = bedrooms;
  if (bathrooms > 0) query.bathrooms = bathrooms;
  
  // Add location search (case-insensitive regex on city or address)
  if (location) {
    query.$or = [
      { "location.city": { $regex: location, $options: "i" } },
      { "location.address": { $regex: location, $options: "i" } }
    ];
  }

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
              {properties.length > 0 ? properties.map((property: any, index: number) => (
                <PropertyCard key={property._id} property={property} index={index} />
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
