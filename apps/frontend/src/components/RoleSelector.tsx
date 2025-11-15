import { UserRound, Stethoscope, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type UserRole = "patient" | "doctor" | "clinic";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const roleOptions = [
  {
    role: "patient" as UserRole,
    icon: UserRound,
    title: "Patient",
    description: "Book appointments and manage your health records",
  },
  {
    role: "doctor" as UserRole,
    icon: Stethoscope,
    title: "Doctor",
    description: "Manage appointments and patient consultations",
  },
  {
    role: "clinic" as UserRole,
    icon: Building2,
    title: "Clinic",
    description: "Oversee your clinic operations and staff",
  },
];

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Medical Reservation System
        </h1>
        <p className="text-muted-foreground text-lg">
          Select your role to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.role}
              className="group relative overflow-hidden border-border/50 hover:border-primary hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => onRoleSelect(option.role)}
            >
              <div className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">{option.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {option.description}
                </p>
                <Button variant="hero" size="lg" className="w-full mt-4">
                  Continue as {option.title}
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
