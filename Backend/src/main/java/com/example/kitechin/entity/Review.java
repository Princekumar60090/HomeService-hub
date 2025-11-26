package com.example.kitechin.entity;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    private ObjectId id;

    @NotNull(message = "Customer ID is required")
    private ObjectId customerId;

    @NotNull(message = "Staff ID is required")
    private ObjectId staffId;

    @NotNull(message = "Booking ID is required")
    private ObjectId bookingId; // Link review to a specific job

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Integer rating;

    @Size(max = 500, message = "Comment cannot exceed 500 characters")
    private String comment;

    @CreatedDate
    private LocalDateTime createdAt;
}