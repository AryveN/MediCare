import { Heart, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-soft)]">
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MediCare
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Reservation System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" size="sm">
              About Us
            </Button>
            <Button variant="ghost" size="sm">
              Services
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Mail className="w-4 h-4 mr-2" />
              Help
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Button variant="outline" size="sm">
              Emergency
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
