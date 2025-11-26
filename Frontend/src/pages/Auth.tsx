import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { StaffCategory, UserRole } from "@/data/mockData";
import { toast } from "sonner";
import { api } from "../api";

const Auth = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<UserRole>(UserRole.CUSTOMER);
  const [showStaffPendingModal, setShowStaffPendingModal] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  // Security: Reset to "login" mode whenever the user switches tabs
  useEffect(() => {
    setAuthMode("login");
  }, [userType]);

  // --- 1. REAL LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        let endpoint = "";
        if (userType === UserRole.CUSTOMER) endpoint = "/customer/login";
        else if (userType === UserRole.STAFF) endpoint = "/staff/login";
        else if (userType === UserRole.ADMIN) endpoint = "/admin/login";

        console.log(`Attempting login to: ${endpoint}`);

        const response = await api.post(`${endpoint}?email=${email}&password=${password}`);

        if (response.data) {
            console.log("Login Successful:", response.data);
            toast.success(`Welcome back, ${response.data.name}!`);

            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("role", userType);

            if (userType === UserRole.ADMIN) navigate("/admin");
            else if (userType === UserRole.STAFF) navigate("/staff");
            else navigate("/customer");
        }
    } catch (error: any) {
        console.error("Login Error:", error);
        toast.error("Login Failed: " + (error.response?.data?.message || "Invalid credentials"));
    }
  };

  // --- 2. REAL REGISTRATION LOGIC (Customer & Staff Only) ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        if (userType === UserRole.CUSTOMER) {
            const payload = { name, email, password, phone, address };
            await api.post("/customer/register", payload);
            toast.success("Customer Registration successful! Please login.");
            setAuthMode("login");

        } else if (userType === UserRole.STAFF) {
            const payload = { name, email, password, phone, city, category };
            await api.post("/staff/register", payload);
            setShowStaffPendingModal(true);
        } 
        // Admin registration logic is intentionally hidden from UI

    } catch (error: any) {
        console.error("Registration Error:", error);
        toast.error("Registration Failed: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {userType === UserRole.ADMIN 
                ? "Administrator Access Portal"
                : (authMode === "login" ? "Sign in to access your dashboard" : "Register to get started")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={userType} onValueChange={(v) => setUserType(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value={UserRole.CUSTOMER}>Customer</TabsTrigger>
                <TabsTrigger value={UserRole.STAFF}>Staff</TabsTrigger>
                <TabsTrigger value={UserRole.ADMIN}>Admin</TabsTrigger>
              </TabsList>

              {/* --- CUSTOMER FORM --- */}
              <TabsContent value={UserRole.CUSTOMER}>
                <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
                      <div><Label>Phone Number</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                      <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
                    </>
                  )}
                  <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground">
                    {authMode === "login" ? "Sign In" : "Register"}
                  </Button>
                </form>
              </TabsContent>

              {/* --- STAFF FORM --- */}
              <TabsContent value={UserRole.STAFF}>
                <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
                      <div><Label>Phone Number</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                      <div><Label>City</Label>
                        <Select value={city} onValueChange={setCity} required>
                          <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Lucknow">Lucknow</SelectItem>
                            <SelectItem value="Patna">Patna</SelectItem>
                            <SelectItem value="Kanpur">Kanpur</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Category</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value={StaffCategory.MAID}>Maid</SelectItem>
                            <SelectItem value={StaffCategory.MECHANIC}>Mechanic</SelectItem>
                            <SelectItem value={StaffCategory.WORKER}>Worker</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground">
                    {authMode === "login" ? "Sign In" : "Register"}
                  </Button>
                </form>
              </TabsContent>

              {/* --- ADMIN FORM (LOGIN ONLY - NO REGISTER) --- */}
              <TabsContent value={UserRole.ADMIN}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200 mb-4">
                    Note: Admin registration is restricted. Please log in with your credentials.
                  </div>
                  <div>
                    <Label>Admin Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground">
                    Admin Sign In
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Only show Register toggle for Customer and Staff */}
            {userType !== UserRole.ADMIN && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="text-primary hover:underline text-sm"
                >
                  {authMode === "login" 
                    ? "Don't have an account? Register" 
                    : "Already have an account? Sign In"}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staff Pending Modal */}
      <Dialog open={showStaffPendingModal} onOpenChange={setShowStaffPendingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-success">Registration Successful!</DialogTitle>
            <DialogDescription className="pt-4 space-y-3">
              <p className="font-semibold text-foreground">Your account is <span className="text-warning">PENDING</span> Admin approval.</p>
              <p className="text-muted-foreground">You cannot login until verified (24-48 hrs).</p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setShowStaffPendingModal(false); navigate("/"); }}>OK, Got it</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;