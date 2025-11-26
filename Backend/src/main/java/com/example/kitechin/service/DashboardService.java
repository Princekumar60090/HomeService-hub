package com.example.kitechin.service;

import com.example.kitechin.dto.DashboardStats;
import com.example.kitechin.entity.Booking;
import com.example.kitechin.entity.BookingStatus;
import com.example.kitechin.repository.BookingRepository;
import com.example.kitechin.repository.CustomerRepository;
import com.example.kitechin.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final BookingRepository bookingRepository;

    public DashboardStats getStats() {
        // 1. Calculate User Counts
        long totalCustomers = customerRepository.count();
        long totalStaff = staffRepository.count();
        long pendingApprovals = staffRepository.findByApproved(false).size();
        long activeStaff = totalStaff - pendingApprovals;

        // 2. Calculate Booking Counts
        List<Booking> allBookings = bookingRepository.findAll();
        long totalBookings = allBookings.size();

        long pendingBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();

        long completedBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();

        long cancelledBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                .count();

        // 3. Calculate Revenue (Sum of price for COMPLETED jobs only)
        // We treat null prices as 0.0 to avoid crashes
        double revenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && b.getPrice() != null)
                .mapToDouble(Booking::getPrice)
                .sum();

        return DashboardStats.builder()
                .totalCustomers(totalCustomers)
                .totalStaff(totalStaff)
                .activeStaff(activeStaff)
                .pendingApprovals(pendingApprovals)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .totalRevenue(revenue)
                .build();
    }
}