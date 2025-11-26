package com.example.kitechin.controller;

import com.example.kitechin.entity.Customer;
import com.example.kitechin.service.CustomerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@Tag(name="Customer APIs")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/register")
    public Customer register(@RequestBody Customer customer) {
        return customerService.register(customer);
    }

    @PostMapping("/login")
    public Optional<Customer> login(@RequestParam String email, @RequestParam String password) {
        return customerService.login(email, password);
    }
}
