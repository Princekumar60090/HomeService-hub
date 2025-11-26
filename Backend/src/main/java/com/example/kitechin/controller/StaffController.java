package com.example.kitechin.controller;

import com.example.kitechin.entity.Staff;
import com.example.kitechin.entity.StaffCategory;
import com.example.kitechin.service.StaffService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@Tag(name="Staff APIs")
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/register")
    public Staff register(@RequestBody Staff staff) {
        return staffService.registerStaff(staff);
    }

    @PostMapping("/login")
    public Optional<Staff> login(@RequestParam String email, @RequestParam String password) {
        return staffService.login(email, password);
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/pending")
    public List<Staff> getPendingApprovals() {
        return staffService.getPendingApprovals();
    }

    // Endpoint for APPROVE Button
    @PostMapping("/approve/{id}")
    public Staff approve(@PathVariable String id) {
        return staffService.approveStaff(id);
    }

    // Endpoint for REJECT Button (NEW)
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> removeStaff(@PathVariable String id) {
        staffService.removeStaff(id);
        return ResponseEntity.ok("Staff removed successfully");
    }

    // --- SEARCH ENDPOINTS ---

    @GetMapping("/category/{category}")
    public List<Staff> getByCategory(@PathVariable StaffCategory category) {
        return staffService.getStaffByCategory(category);
    }

    @GetMapping("/search/{city}/{category}")
    public List<Staff> searchStaff(@PathVariable String city,
                                   @PathVariable StaffCategory category) {
        return staffService.searchStaff(city, category);
    }
}