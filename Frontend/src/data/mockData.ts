export enum StaffCategory {
  MAID = "MAID",
  MECHANIC = "MECHANIC",
  WORKER = "WORKER",
  OTHER = "OTHER",
}

export enum BookingStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
}

export interface Staff extends User {
  category: StaffCategory;
  city: string;
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  profilePicture?: string;
  idProof?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  staffId?: string;
  staffName?: string;
  category: StaffCategory;
  city: string;
  bookingDate: string;
  timeSlot: string;
  problemDescription: string;
  serviceAddress: string;
  status: BookingStatus;
  price?: number;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  staffId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@kitchensolution.com",
    phone: "+91-9999999999",
    role: UserRole.ADMIN,
  },
  {
    id: "customer-1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91-9876543210",
    role: UserRole.CUSTOMER,
    address: "123, MG Road, Lucknow, Uttar Pradesh",
  },
  {
    id: "customer-2",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91-9876543211",
    role: UserRole.CUSTOMER,
    address: "456, Station Road, Patna, Bihar",
  },
];

// Mock Staff (Approved)
export const mockStaff: Staff[] = [
  {
    id: "staff-1",
    name: "Sunita Devi",
    email: "sunita@example.com",
    phone: "+91-9876543220",
    role: UserRole.STAFF,
    category: StaffCategory.MAID,
    city: "Lucknow",
    rating: 4.8,
    reviewCount: 45,
    isApproved: true,
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    id: "staff-2",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91-9876543221",
    role: UserRole.STAFF,
    category: StaffCategory.MECHANIC,
    city: "Lucknow",
    rating: 4.6,
    reviewCount: 38,
    isApproved: true,
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: "staff-3",
    name: "Amit Verma",
    email: "amit@example.com",
    phone: "+91-9876543222",
    role: UserRole.STAFF,
    category: StaffCategory.WORKER,
    city: "Patna",
    rating: 4.7,
    reviewCount: 52,
    isApproved: true,
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    id: "staff-4",
    name: "Meera Devi",
    email: "meera@example.com",
    phone: "+91-9876543223",
    role: UserRole.STAFF,
    category: StaffCategory.MAID,
    city: "Patna",
    rating: 4.9,
    reviewCount: 67,
    isApproved: true,
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    id: "staff-5",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91-9876543224",
    role: UserRole.STAFF,
    category: StaffCategory.MECHANIC,
    city: "Patna",
    rating: 4.5,
    reviewCount: 29,
    isApproved: true,
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  },
];

// Mock Pending Staff (awaiting approval)
export const mockPendingStaff: Staff[] = [
  {
    id: "staff-pending-1",
    name: "Ramesh Yadav",
    email: "ramesh@example.com",
    phone: "+91-9876543230",
    role: UserRole.STAFF,
    category: StaffCategory.WORKER,
    city: "Lucknow",
    rating: 0,
    reviewCount: 0,
    isApproved: false,
    idProof: "https://example.com/id-proof-1.pdf",
  },
  {
    id: "staff-pending-2",
    name: "Geeta Kumari",
    email: "geeta@example.com",
    phone: "+91-9876543231",
    role: UserRole.STAFF,
    category: StaffCategory.MAID,
    city: "Patna",
    rating: 0,
    reviewCount: 0,
    isApproved: false,
    idProof: "https://example.com/id-proof-2.pdf",
  },
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    customerId: "customer-1",
    customerName: "Rahul Sharma",
    staffId: "staff-1",
    staffName: "Sunita Devi",
    category: StaffCategory.MAID,
    city: "Lucknow",
    bookingDate: "2025-12-01",
    timeSlot: "10:00 AM - 12:00 PM",
    problemDescription: "Need help with house cleaning and organization",
    serviceAddress: "123, MG Road, Lucknow, Uttar Pradesh",
    status: BookingStatus.COMPLETED,
    price: 800,
  },
  {
    id: "booking-2",
    customerId: "customer-1",
    customerName: "Rahul Sharma",
    category: StaffCategory.MECHANIC,
    city: "Lucknow",
    bookingDate: "2025-12-05",
    timeSlot: "2:00 PM - 4:00 PM",
    problemDescription: "AC not cooling properly, needs servicing",
    serviceAddress: "123, MG Road, Lucknow, Uttar Pradesh",
    status: BookingStatus.PENDING,
  },
  {
    id: "booking-3",
    customerId: "customer-2",
    customerName: "Priya Singh",
    staffId: "staff-3",
    staffName: "Amit Verma",
    category: StaffCategory.WORKER,
    city: "Patna",
    bookingDate: "2025-11-28",
    timeSlot: "9:00 AM - 11:00 AM",
    problemDescription: "Furniture assembly and wall mounting",
    serviceAddress: "456, Station Road, Patna, Bihar",
    status: BookingStatus.ASSIGNED,
    price: 1200,
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: "review-1",
    bookingId: "booking-1",
    customerId: "customer-1",
    staffId: "staff-1",
    rating: 5,
    comment: "Excellent service! Very professional and thorough.",
    createdAt: "2025-12-01T14:30:00Z",
  },
];
