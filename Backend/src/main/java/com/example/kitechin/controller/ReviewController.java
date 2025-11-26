package com.example.kitechin.controller;

import com.example.kitechin.entity.Review;
import com.example.kitechin.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name="Review APIs")
public class ReviewController {

    private final ReviewService reviewService;

    // Customer writes a review
    // Example JSON: { "bookingId": "...", "rating": 5, "comment": "Great work!" }
    @PostMapping("/add")
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    // Get all reviews for a specific staff member
    @GetMapping("/{staffId}")
    public List<Review> getStaffReviews(@PathVariable String staffId) {
        return reviewService.getReviewsForStaff(staffId);
    }
}