package com.example.kitechin.controller;

import com.example.kitechin.entity.Admin;
import com.example.kitechin.service.AdminService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Tag(name="Admin APIs")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {
        return adminService.register(admin);
    }

    @PostMapping("/login")
    public Optional<Admin> login(@RequestParam String email, @RequestParam String password) {
        return adminService.login(email, password);
    }
}
