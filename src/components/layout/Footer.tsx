import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-foreground/5 py-12 border-t border-foreground/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4 inline-block">
            Asmerat Real Estate
          </Link>
          <p className="text-foreground/70 mb-6 max-w-sm">
            Your premium platform for finding the perfect home, apartment, or plot. We make real estate simple and beautiful.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-foreground/50 hover:text-blue-500 transition-colors"><FiFacebook size={24} /></a>
            <a href="#" className="text-foreground/50 hover:text-blue-400 transition-colors"><FiTwitter size={24} /></a>
            <a href="#" className="text-foreground/50 hover:text-pink-500 transition-colors"><FiInstagram size={24} /></a>
            <a href="#" className="text-foreground/50 hover:text-blue-700 transition-colors"><FiLinkedin size={24} /></a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/properties" className="text-foreground/70 hover:text-foreground transition-colors">Properties</Link></li>
            <li><Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link href="/services" className="text-foreground/70 hover:text-foreground transition-colors">Services</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-foreground/70">
            <li>123 Real Estate Blvd</li>
            <li>Cityville, ST 12345</li>
            <li>contact@asmerat.com</li>
            <li>+1 (555) 123-4567</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-foreground/10 text-center text-foreground/50">
        <p>&copy; {new Date().getFullYear()} Asmerat Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
}
