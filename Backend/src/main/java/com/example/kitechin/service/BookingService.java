package com.example.kitechin.service;

import com.example.kitechin.entity.*;
import com.example.kitechin.repository.*;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;

    // 1. Create Booking
    public Booking createBooking(Booking booking) {
        // Validation: Check if customer exists
        if (!customerRepository.existsById(booking.getCustomerId())) {
            throw new RuntimeException("Invalid Customer ID");
        }

        // Default values for a new booking
        booking.setStatus(BookingStatus.PENDING);
        booking.setStaffId(null);
        booking.setPrice(null);

        return bookingRepository.save(booking);
    }

    // 2. Admin Assigns Staff
    public Booking assignStaff(String bookingId, String staffId, Double price) {
        Booking booking = bookingRepository.findById(new ObjectId(bookingId))
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Staff staff = staffRepository.findById(new ObjectId(staffId))
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (!staff.getCategory().equals(booking.getCategory())) {
            throw new RuntimeException("Staff category mismatch.");
        }

        booking.setStaffId(staff.getId());
        booking.setPrice(price);
        booking.setStatus(BookingStatus.ASSIGNED);

        return bookingRepository.save(booking);
    }

    // --- NEW: Cancel Booking Logic ---
    public Booking cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(new ObjectId(bookingId))
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Rule 1: Cannot cancel a completed job
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed job.");
        }

        // Rule 2: Cannot cancel if already cancelled
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled.");
        }

        // Change status to CANCELLED
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    // --- Existing Helper Methods ---

    public List<Booking> getCustomerBookings(String customerId) {
        return bookingRepository.findByCustomerId(new ObjectId(customerId));
    }

    public List<Booking> getAllPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    public Booking completeBooking(String bookingId) {
        Booking booking = bookingRepository.findById(new ObjectId(bookingId))
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(booking);
    }

    public List<Booking> getStaffBookings(String staffId) {
        return bookingRepository.findByStaffId(new ObjectId(staffId));
    }
}