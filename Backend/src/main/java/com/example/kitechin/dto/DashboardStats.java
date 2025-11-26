package com.example.kitechin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    // User Stats
    private long totalCustomers;
    private long totalStaff;
    private long activeStaff;       // Staff who are approved
    private long pendingApprovals;  // Staff waiting for verification

    // Booking Stats
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long cancelledBookings;

    // Financials
    private Double totalRevenue;    // Sum of price from all COMPLETED bookings
}