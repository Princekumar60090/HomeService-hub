import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Calendar, Clock, MapPin, CheckCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "../api";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchMyJobs(parsedUser.id);
  }, [navigate]);

  const fetchMyJobs = async (staffId: string) => {
    try {
      // CALL REAL BACKEND API
      const response = await api.get(`/bookings/staff/${staffId}`);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Could not load your jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (bookingId: string) => {
    try {
        await api.post(`/bookings/complete/${bookingId}`);
        toast.success("Job Marked as Completed!");
        // Refresh list
        if (user) fetchMyJobs(user.id);
    } catch (error) {
        toast.error("Failed to update job status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500";
      case "ASSIGNED": return "bg-blue-500";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header userRole="staff" userName={user?.name} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* --- PROFILE SECTION --- */}
        <Card className="bg-primary/5 border-none">
            <CardContent className="p-6 flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-white shadow-sm">
                    {user?.profilePicture ? (
                        <img src={`http://localhost:8080/staff/docs/image/${user.profilePicture}`} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-12 w-12 text-gray-400" />
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Badge variant="outline" className="bg-white">{user?.category}</Badge>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user?.city}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-amber-600">
                        ⭐ {user?.rating || "New"} Rating ({user?.reviewCount || 0} reviews)
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* --- MY JOBS LIST --- */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Assigned Jobs</h2>
          
          {jobs.length === 0 ? (
            <div className="text-center p-10 border rounded-lg bg-gray-50 text-gray-500">
              You have no assigned jobs yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Customer Booking #{job.id.substring(0,6)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {job.serviceCategory} Service
                        </p>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm space-y-2">
                        <div className="font-semibold">Job Details:</div>
                        <p>{job.problemDescription}</p>
                        <div className="flex items-center gap-2 text-muted-foreground pt-2">
                            <MapPin className="w-4 h-4" /> {job.serviceAddress}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {job.bookingDate}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {job.timeSlot}
                        </div>
                      </div>

                      {job.status === "ASSIGNED" && (
                          <Button 
                            onClick={() => handleCompleteJob(job.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                          </Button>
                      )}
                    </div>
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

export default StaffDashboard;