import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone } from "lucide-react";
import { api } from "../api"; // Real API connection
import { toast } from "sonner";

// Define what a Staff member looks like
interface Staff {
  id: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  profilePicture?: string;
  price?: number; // Optional if you added this
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const city = searchParams.get("city");
  const category = searchParams.get("category");

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!city || !category) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Searching for ${category} in ${city}...`);
        
        // CALL REAL BACKEND API
        const response = await api.get(`/staff/search/${city}/${category}`);
        
        console.log("Found Staff:", response.data);
        setStaffList(response.data);
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("Failed to load staff results");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [city, category]);

  // Handle "Book Now" click
  const handleBookNow = (staffId: string) => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
        toast.error("Please login to book a service");
        navigate("/auth");
        return;
    }
    // Navigate to dashboard or booking flow (Simple redirect for now)
    navigate("/customer");
    toast.info("Please create a booking request from your dashboard.");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-8">
          Showing results for <span className="font-semibold text-primary">{category}</span> in <span className="font-semibold text-primary">{city}</span>
        </p>

        {loading ? (
          <div className="text-center py-20">Loading professionals...</div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-20 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-600">No staff found matching your criteria.</h2>
            <p className="text-gray-500 mt-2">Try searching for a different city or category.</p>
            <Button className="mt-4" onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staffList.map((staff) => (
              <Card key={staff.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Use real profile pic or a placeholder */}
                  <img 
                    src={staff.profilePicture ? `http://localhost:8080/staff/docs/image/${staff.profilePicture}` : "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"} 
                    alt={staff.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-white text-black hover:bg-white">
                    {staff.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{staff.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{staff.rating || "New"}</span>
                      <span className="text-gray-400 text-sm font-normal">({staff.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{staff.city}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" onClick={() => handleBookNow(staff.id)}>
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;