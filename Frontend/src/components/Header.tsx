import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, Wrench, Sparkles, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  userRole?: string;
  userName?: string;
}


export const Header = ({ userRole: propRole, userName: propName }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
        localStorage.removeItem("user");
      }
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    navigate("/");
  };

  const services = [
    { name: "Plumber", icon: Wrench, path: "/services/plumber" },
    { name: "Maid", icon: Sparkles, path: "/services/maid" },
    { name: "Cook", icon: ChefHat, path: "/services/cook" },
  ];

  const displayUser = user;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">KitchenSolution</span>
          </Link>
          <nav className="flex items-center gap-8">
            {!displayUser && (
              <div className="flex items-center gap-4">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Button
                      key={service.path}
                      asChild
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-accent/10"
                    >
                      <Link to={service.path}>
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{service.name}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            )}
            {displayUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-semibold text-foreground">{displayUser.name}</span>
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};