package com.example.kitechin.service;

import com.example.kitechin.entity.*;
import com.example.kitechin.repository.*;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final StaffRepository staffRepository;

    public Review addReview(Review review) {
        // 1. Validation: Check if booking exists
        Booking booking = bookingRepository.findById(review.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 2. Validation: Can only review COMPLETED jobs
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("You can only review completed jobs.");
        }

        // 3. Validation: Prevent duplicate reviews
        if (reviewRepository.existsByBookingId(review.getBookingId())) {
            throw new RuntimeException("You have already reviewed this job.");
        }

        // 4. Save the review
        review.setStaffId(booking.getStaffId()); // Ensure review links to the correct staff
        Review savedReview = reviewRepository.save(review);

        // 5. UPDATE STAFF RATING (The Real World Logic)
        updateStaffRating(booking.getStaffId());

        return savedReview;
    }

    private void updateStaffRating(ObjectId staffId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        List<Review> reviews = reviewRepository.findByStaffId(staffId);

        if (reviews.isEmpty()) {
            staff.setRating(0.0);
            staff.setReviewCount(0);
        } else {
            double average = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            // Round to 1 decimal place (e.g., 4.5)
            double roundedAverage = Math.round(average * 10.0) / 10.0;

            staff.setRating(roundedAverage);
            staff.setReviewCount(reviews.size());
        }

        staffRepository.save(staff);
    }

    public List<Review> getReviewsForStaff(String staffId) {
        return reviewRepository.findByStaffId(new ObjectId(staffId));
    }
}