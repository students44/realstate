import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyCarousel from "./PropertyCarousel";

async function getLatestProperties() {
  try {
    await dbConnect();
    const properties = await Property.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    
    // Serialize MongoDB objects for Client Component (PropertyCarousel)
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error("LatestProperties fetch error:", error);
    return [];
  }
}

export default async function LatestProperties() {
  const properties = await getLatestProperties();

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <PropertyCarousel properties={properties} />
      </div>
    </section>
  );
}

