import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";
import PatientDashboard from "@/components/PatientDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";
import medicalHero from "@/assets/medical-hero.jpg";

type UserRole = "patient" | "doctor" | "clinic" | null;

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setSelectedRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedRole(null);
  };

  if (isLoggedIn && selectedRole === "patient") {
    return <PatientDashboard onLogout={handleLogout} />;
  }

  if (isLoggedIn && selectedRole === "doctor") {
    return <DoctorDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${medicalHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full py-12">
          {selectedRole ? (
            <AuthForm role={selectedRole} onBack={() => setSelectedRole(null)} onLogin={handleLogin} />
          ) : (
            <RoleSelector onRoleSelect={setSelectedRole} />
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      </div>
    </div>
  );
};

export default Index;
