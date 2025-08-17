import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-headline font-bold text-primary">
                RajyaBazaar
              </span>
            </Link>
            <p className="text-muted-foreground text-center md:text-left text-sm">
              Carrying the legacy of the Maratha Empire forward.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 font-body">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/ai-styler" className="text-muted-foreground hover:text-primary transition-colors">AI Styler</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 font-body">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 font-body">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <div className="text-center space-y-3">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              © 2025 RajyaBazaar. This is a demo student portfolio project. Products are shown for educational purposes only and are not for actual sale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} RajyaBazaar. All rights reserved.
              </p>
              <a 
                href="https://github.com/yogendra-27-bhange" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 hover:underline"
              >
                🔗 View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
