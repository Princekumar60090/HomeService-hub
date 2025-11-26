import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Users, UserCheck, IndianRupee, CheckCircle, XCircle } from "lucide-react";
import { api } from "../api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeStaff: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });
  const [pendingStaff, setPendingStaff] = useState<any[]>([]);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  
  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get("/admin/dashboard/stats");
      setStats(statsRes.data);

      const staffRes = await api.get("/staff/pending");
      setPendingStaff(staffRes.data);

      const bookingRes = await api.get("/bookings/pending");
      setPendingBookings(bookingRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  // --- STAFF ACTIONS ---

  const handleApproveStaff = async (id: string) => {
    try {
      await api.post(`/staff/approve/${id}`);
      toast.success("Staff Approved Successfully");
      fetchDashboardData(); // Refresh list
    } catch (error) {
      toast.error("Failed to approve staff");
    }
  };

  // NEW: Reject Logic using POST (Fixes the error)
  const handleRejectStaff = async (id: string) => {
    if(!confirm("Are you sure you want to reject this staff application?")) return;
    
    try {
        // FIX: Use .post() instead of .delete()
        await api.post(`/staff/remove/${id}`);
        
        toast.success("Staff Application Rejected");
        fetchDashboardData(); // Refresh list
    } catch (error) {
        console.error("Reject failed:", error);
        toast.error("Failed to reject staff");
    }
  };

  // --- ASSIGNMENT LOGIC ---
  const openAssignModal = async (booking: any) => {
    setSelectedBooking(booking);
    try {
        const res = await api.get(`/staff/category/${booking.serviceCategory || booking.category}`);
        setAvailableStaff(res.data);
        setIsAssignModalOpen(true);
    } catch (error) {
        toast.error("Could not fetch available staff");
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaffId || !price) {
        toast.error("Please select staff and enter price");
        return;
    }
    try {
        await api.post(`/bookings/assign?bookingId=${selectedBooking.id}&staffId=${selectedStaffId}&price=${price}`);
        toast.success("Staff Assigned Successfully!");
        setIsAssignModalOpen(false);
        fetchDashboardData();
    } catch (error) {
        toast.error("Assignment Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header userRole="admin" userName="Admin" />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* --- STATS CARDS --- */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <h2 className="text-3xl font-bold">{stats.totalCustomers}</h2>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
                <h2 className="text-3xl font-bold">{stats.activeStaff}</h2>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h2 className="text-3xl font-bold">₹{stats.totalRevenue}</h2>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <IndianRupee className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- PENDING STAFF APPROVALS --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Staff Approval Queue</h2>
          {pendingStaff.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50 text-gray-500">
                No staff waiting for approval.
            </div>
          ) : (
            pendingStaff.map((staff) => (
              <Card key={staff.id}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Category: {staff.category} | City: {staff.city} | Phone: {staff.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                        variant="destructive"
                        onClick={() => handleRejectStaff(staff.id)}
                    >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    
                    <Button 
                        onClick={() => handleApproveStaff(staff.id)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* --- PENDING BOOKINGS --- */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Bookings</h2>
          {pendingBookings.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50 text-gray-500">
                No pending bookings.
            </div>
          ) : (
            pendingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{booking.category || booking.serviceCategory} Service</h3>
                    <p className="text-sm">Date: {booking.bookingDate} | Time: {booking.timeSlot}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Address: {booking.serviceAddress}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      Issue: "{booking.problemDescription}"
                    </p>
                  </div>
                  <Button onClick={() => openAssignModal(booking)}>
                    Assign Staff
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* --- ASSIGN STAFF MODAL --- */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Staff</DialogTitle>
            <DialogDescription>
              Select a staff member for this {selectedBooking?.category} job.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Select Staff</Label>
                <Select onValueChange={setSelectedStaffId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a staff member" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableStaff.length === 0 ? (
                            <SelectItem value="none" disabled>No staff found in this category</SelectItem>
                        ) : (
                            availableStaff.map(staff => (
                                <SelectItem key={staff.id} value={staff.id}>
                                    {staff.name} ({staff.rating || "New"}★) - {staff.city}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Final Price (₹)</Label>
                <Input 
                    type="number" 
                    placeholder="Enter amount" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <Button className="w-full" onClick={handleAssignStaff}>
                Confirm Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;