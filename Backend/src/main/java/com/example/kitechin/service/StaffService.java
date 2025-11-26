package com.example.kitechin.service;

import com.example.kitechin.entity.*;
import com.example.kitechin.repository.*;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    public Staff registerStaff(Staff staff) {
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        staff.setApproved(false);
        return staffRepository.save(staff);
    }

    public Optional<Staff> login(String email, String password) {
        Optional<Staff> staff = staffRepository.findByEmail(email);
        if (staff.isPresent() &&
                staff.get().isApproved() &&
                passwordEncoder.matches(password, staff.get().getPassword())) {
            return staff;
        }
        return Optional.empty();
    }

    public List<Staff> getPendingApprovals() {
        return staffRepository.findByApproved(false);
    }

    // --- ADMIN FEATURES (CRITICAL FOR DASHBOARD) ---

    // 1. Approve Staff
    public Staff approveStaff(String id) {
        Staff s = staffRepository.findById(new ObjectId(id))
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        s.setApproved(true);
        return staffRepository.save(s);
    }

    // 2. Remove/Reject Staff (This was missing!)
    public void removeStaff(String id) {
        if (!staffRepository.existsById(new ObjectId(id))) {
            throw new RuntimeException("Staff not found");
        }
        staffRepository.deleteById(new ObjectId(id));
    }

    // --- SEARCH FEATURES ---

    public List<Staff> getStaffByCategory(StaffCategory category) {
        return staffRepository.findByCategoryAndApproved(category, true);
    }

    public List<Staff> searchStaff(String city, StaffCategory category) {
        return staffRepository.findByCityAndCategoryAndApproved(city, category, true);
    }
}