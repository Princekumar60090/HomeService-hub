import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Calendar, Clock, MapPin, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Booking {
  id: string;
  serviceCategory: string;
  category?: string;
  bookingDate: string;
  timeSlot: string;
  serviceAddress: string;
  problemDescription: string;
  status: "PENDING" | "ASSIGNED" | "COMPLETED" | "CANCELLED";
  price?: number;
  staffId?: string;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true); // Start loading as true

  // Form States
  const [city, setCity] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        
        if (!storedUser) {
          console.warn("No user found in localStorage, redirecting to auth");
          navigate("/auth");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        
        // Validate user object structure
        if (!parsedUser || !parsedUser.id) {
             console.error("Invalid user data structure:", parsedUser);
             toast.error("Session invalid. Please login again.");
             localStorage.removeItem("user"); // Clear bad data
             navigate("/auth");
             return;
        }

        setUser(parsedUser);

        // Fetch Bookings using the ID from localStorage
        console.log(`Fetching bookings for customer ID: ${parsedUser.id}`);
        const response = await api.get(`/bookings/history/${parsedUser.id}`);
        console.log("Bookings loaded:", response.data);
        setBookings(response.data);

      } catch (error) {
        console.error("Dashboard Load Error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false); // Stop loading whether success or fail
      }
    };

    loadData();
  }, [navigate]);

  const handleBookService = async () => {
    if (!date || !timeSlot || !address || !description || !serviceCategory || !city) {
      toast.error("Please fill in all fields, including City and Category.");
      return;
    }

    if (!user || !user.id) {
        toast.error("User session not found. Please login again.");
        return;
    }

    try {
      const payload = {
        customerId: user.id,
        category: serviceCategory,
        bookingDate: date,
        timeSlot: timeSlot,
        serviceAddress: `${address}, ${city}`, // Combine address and city
        problemDescription: description,
        status: "PENDING"
      };

      console.log("Sending Booking Payload:", payload);
      await api.post("/bookings/book", payload);
      
      toast.success("Booking Request Sent Successfully!");
      
      // Refresh bookings list
      const response = await api.get(`/bookings/history/${user.id}`);
      setBookings(response.data);

      // Reset crucial form fields
      setDescription("");
      setDate("");
      setAddress("");
    } catch (error: any) {
      console.error("Booking Failed:", error);
      toast.error("Booking Failed: " + (error.response?.data?.message || "Server Error"));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if(!confirm("Are you sure you want to cancel?")) return;

    try {
      await api.post(`/bookings/cancel/${bookingId}`);
      toast.success("Booking Cancelled");
      
      // Refresh list
      if (user?.id) {
          const response = await api.get(`/bookings/history/${user.id}`);
          setBookings(response.data);
      }
    } catch (error) {
      console.error("Cancel failed", error);
      toast.error("Failed to cancel booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500 hover:bg-green-600";
      case "ASSIGNED": return "bg-blue-500 hover:bg-blue-600";
      case "CANCELLED": return "bg-red-500 hover:bg-red-600";
      default: return "bg-yellow-500 hover:bg-yellow-600"; // PENDING
    }
  };

  // --- RENDER LOADING STATE ---
  // This prevents the "White Screen" crash by showing a spinner until data is ready
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header userName={user?.name} userRole="customer" />

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* --- SECTION 1: BOOK A SERVICE --- */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Book a Service</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            
            <div className="space-y-2">
              <Label>City</Label>
              <Select onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lucknow">Lucknow</SelectItem>
                  <SelectItem value="Patna">Patna</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Kanpur">Kanpur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service Category</Label>
              <Select onValueChange={setServiceCategory}>
                <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAID">Maid Service</SelectItem>
                  <SelectItem value="MECHANIC">Mechanic / Repair</SelectItem>
                  <SelectItem value="WORKER">General Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select onValueChange={setTimeSlot}>
                <SelectTrigger><SelectValue placeholder="Select Time" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</SelectItem>
                  <SelectItem value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</SelectItem>
                  <SelectItem value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Input placeholder="Enter your full address (House No, Street, Area)" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Problem Description</Label>
              <Textarea placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <Button className="md:col-span-2 w-full text-lg" onClick={handleBookService}>
              Submit Booking Request
            </Button>
          </CardContent>
        </Card>

        {/* --- SECTION 2: MY BOOKINGS HISTORY --- */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-lg bg-gray-50 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-lg">No bookings found.</p>
              <p className="text-sm">Book a service above to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-primary">
                          {booking.serviceCategory || booking.category} Service
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          ID: {booking.id}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Date:</span> {booking.bookingDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Time:</span> {booking.timeSlot}
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Address:</span> {booking.serviceAddress}
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2 mt-2 pt-2 border-t border-gray-200">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="italic text-gray-600">"{booking.problemDescription}"</span>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    {(booking.status === "PENDING" || booking.status === "ASSIGNED") && (
                      <div className="mt-4 pt-4 flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Booking
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;