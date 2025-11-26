package com.example.kitechin.repository;

import com.example.kitechin.entity.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.*;

public interface StaffRepository extends MongoRepository<Staff, ObjectId> {
    Optional<Staff> findByEmail(String email);
    List<Staff> findByApproved(boolean approved);
//    List<Staff> findByCategory(StaffCategory category);
    List<Staff> findByCategoryAndApproved(StaffCategory category, boolean approved);

   List<Staff> findByCityAndCategoryAndApproved(String city, StaffCategory category, boolean approved);
}
