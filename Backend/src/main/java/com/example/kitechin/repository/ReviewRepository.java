package com.example.kitechin.repository;

import com.example.kitechin.entity.Review;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, ObjectId> {

    // Find all reviews for a specific staff member
    List<Review> findByStaffId(ObjectId staffId);

    // Check if a review already exists for this booking (Prevent duplicate reviews)
    boolean existsByBookingId(ObjectId bookingId);
}