package com.example.kitechin.controller;

import com.example.kitechin.dto.DashboardStats;
import com.example.kitechin.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@Tag(name="Admin Dashboard APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    // Endpoint: GET /admin/dashboard/stats
    @GetMapping("/stats")
    public DashboardStats getStats() {
        return dashboardService.getStats();
    }
}