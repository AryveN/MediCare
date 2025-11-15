import { useState } from "react";
import { ArrowLeft, Mail, Lock, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserRole = "patient" | "doctor" | "clinic";

interface AuthFormProps {
  role: UserRole;
  onBack: () => void;
  onLogin: (role: UserRole) => void;
}

const roleLabels = {
  patient: "Patient",
  doctor: "Doctor",
  clinic: "Clinic",
};

const AuthForm = ({ role, onBack, onLogin }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Dummy credentials check
    setTimeout(() => {
      setIsLoading(false);
      if (!isSignUp && email === "john@example.com" && password === "admin123") {
        onLogin(role);
      } else if (isSignUp) {
        // Auto-login after signup
        onLogin(role);
      } else {
        setError("Invalid credentials. Use: john@example.com / admin123");
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to role selection
      </Button>

      <Card className="border-border/50 shadow-[var(--shadow-medium)]">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {roleLabels[role]} Portal
            </h2>
            <p className="text-muted-foreground">
              Sign in or create your account
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="admin123"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot password?
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">
                    {role === "clinic" ? "Clinic Name" : "Full Name"}
                  </Label>
                  <div className="relative">
                    {role === "clinic" ? (
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder={role === "clinic" ? "Clinic name" : "John Doe"}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
