import { Link } from "react-router-dom";
import { Star, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { StaffCard } from "@/components/StaffCard";
import { Header } from "@/components/Header";
import { mockStaff } from "@/data/mockData";

const Index = () => {
  const topRatedStaff = mockStaff.filter(s => s.rating >= 4.7).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Hire Trusted <span className="text-primary">Home Service</span> Professionals
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find verified Maids, Mechanics, and Workers in your city. Quality service at your doorstep.
            </p>
          </div>

          <SearchBar />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Verified Professionals</h3>
              <p className="text-sm text-muted-foreground">All service providers are background verified</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Top Rated</h3>
              <p className="text-sm text-muted-foreground">Choose from highly rated professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quick Booking</h3>
              <p className="text-sm text-muted-foreground">Book services in just a few clicks</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quality Assured</h3>
              <p className="text-sm text-muted-foreground">100% satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Professionals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Top Rated Professionals
            </h2>
            <p className="text-muted-foreground">Meet our highly rated service providers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {topRatedStaff.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 KitchenSolution. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
