package com.example.kitechin.controller;

import com.example.kitechin.entity.Booking;
import com.example.kitechin.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name="Booking APIs")
public class BookingController {

    private final BookingService bookingService;

    // --- Customer Endpoints ---

    // 1. Create a new booking
    @PostMapping("/book")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // 2. View booking history for a specific customer
    @GetMapping("/history/{customerId}")
    public List<Booking> getCustomerHistory(@PathVariable String customerId) {
        return bookingService.getCustomerBookings(customerId);
    }

    // 3. Cancel a booking (NEW FEATURE)
    // Usage: POST /bookings/cancel/65f2a...
    @PostMapping("/cancel/{bookingId}")
    public Booking cancelBooking(@PathVariable String bookingId) {
        return bookingService.cancelBooking(bookingId);
    }

    // --- Admin Endpoints ---

    // 4. View all pending bookings (waiting for staff assignment)
    @GetMapping("/pending")
    public List<Booking> getPendingBookings() {
        return bookingService.getAllPendingBookings();
    }

    // 5. Assign staff to a booking
    @PostMapping("/assign")
    public Booking assignStaff(@RequestParam String bookingId,
                               @RequestParam String staffId,
                               @RequestParam Double price) {
        return bookingService.assignStaff(bookingId, staffId, price);
    }

    // --- Staff Endpoints ---

    // 6. Staff: View their own assigned jobs
    @GetMapping("/staff/{staffId}")
    public List<Booking> getStaffJobs(@PathVariable String staffId) {
        return bookingService.getStaffBookings(staffId);
    }

    // 7. Mark job as completed
    @PostMapping("/complete/{bookingId}")
    public Booking completeJob(@PathVariable String bookingId) {
        return bookingService.completeBooking(bookingId);
    }
}