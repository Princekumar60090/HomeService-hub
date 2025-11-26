package com.example.kitechin.repository;

import com.example.kitechin.entity.Booking;
import com.example.kitechin.entity.BookingStatus;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, ObjectId> {

    // For Customers: "Show my history"
    List<Booking> findByCustomerId(ObjectId customerId);

    // For Staff: "Show my assigned jobs"
    List<Booking> findByStaffId(ObjectId staffId);

    // For Admin: "Show all pending requests"
    List<Booking> findByStatus(BookingStatus status);

    // For Staff Dashboard: "Show my active/pending jobs only"
    List<Booking> findByStaffIdAndStatus(ObjectId staffId, BookingStatus status);
}