import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";
import ImageGallery from "@/components/properties/ImageGallery";
import PropertyActions from "@/components/properties/PropertyActions"; // New client component
import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User"; // Import User for population
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  // Populate owner to get their phone number
  const rawProperty = await Property.findOne({ slug }).populate("owner", "name phone").lean();

  if (!rawProperty) {
    notFound();
  }

  // Convert _id for components
  const property: any = {
     ...rawProperty,
     _id: String(rawProperty._id),
     owner: {
       ...rawProperty.owner,
       _id: String((rawProperty.owner as any)._id)
     }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // WhatsApp logic
  const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const message = `Hi, I'm interested in your property "${property.title}" on Asmerat Real Estate. Can you provide more details?\n\nView property: ${domain}/properties/${property.slug}`;
  const phone = (property.owner?.phone || "923000000000").replace(/\D/g, ""); // Clean phone number
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold px-3 py-1 rounded-full text-sm">
                For {property.purpose}
              </span>
              <span className="bg-foreground/5 text-foreground font-medium px-3 py-1 rounded-full text-sm">
                {property.propertyType}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              {property.title}
            </h1>
            <div className="flex items-center text-foreground/60 text-lg">
              <FiMapPin className="mr-2 text-blue-500" />
              {property.location.address}, {property.location.city}, {property.location.state}
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-6">
            <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              {formatPrice(property.price)}
            </div>
            {/* Interactive Buttons */}
            <PropertyActions 
              propertyId={property._id} 
              title={property.title} 
              slug={property.slug} 
            />
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          <ImageGallery images={property.images} title={property.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Key Specs */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-foreground/10">
              <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4">
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                  <FaBed size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{property.bedrooms}</div>
                  <div className="text-foreground/50 text-sm uppercase tracking-wider font-semibold">Bedrooms</div>
                </div>
              </div>
              <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4 border-l border-foreground/10 pl-6">
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                  <FaBath size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{property.bathrooms}</div>
                  <div className="text-foreground/50 text-sm uppercase tracking-wider font-semibold">Bathrooms</div>
                </div>
              </div>
              <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4 border-l border-foreground/10 pl-6">
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold font-serif text-xl h-[56px] w-[56px]">
                  m²
                </div>
                <div>
                  <div className="text-2xl font-bold">{new Intl.NumberFormat().format(property.area)}</div>
                  <div className="text-foreground/50 text-sm uppercase tracking-wider font-semibold">{property.areaUnit}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                <p>{property.description}</p>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Premium Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-foreground/80">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Contact Form */}
          <div className="lg:col-span-1 border-t lg:border-t-0 pt-8 lg:pt-0">
             <div className="sticky top-24 bg-foreground/5 backdrop-blur-md rounded-2xl p-8 border border-foreground/10 shadow-xl">
               <h3 className="text-2xl font-bold mb-6">Contact Agent</h3>
               <form className="space-y-4">
                 <div>
                   <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" required />
                 </div>
                 <div>
                   <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" required />
                 </div>
                 <div>
                   <input type="tel" placeholder="Your Phone" className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                 </div>
                 <div>
                   <textarea placeholder="I am interested in this property..." rows={4} className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none" required defaultValue={`Hi, I found your property "${property.title}" on Asmerat Real Estate and would like to arrange a viewing.`}></textarea>
                 </div>
                 <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95">
                   Send Message
                 </button>
               </form>
               
               <div className="mt-8 pt-8 border-t border-foreground/10 text-center">
                 <p className="text-foreground/50 mb-4 font-medium uppercase tracking-wider text-sm">Or contact directly via</p>
                 <a 
                   href={whatsappUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20 cursor-pointer"
                 >
                    WhatsApp Message
                 </a>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
