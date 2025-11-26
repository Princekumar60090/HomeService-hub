package com.example.kitechin.service;

import com.example.kitechin.entity.Customer;
import com.example.kitechin.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer register(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> login(String email, String password) {
        Optional<Customer> existing = customerRepository.findByEmail(email);
        if (existing.isPresent() && existing.get().getPassword().equals(password)) {
            return existing;
        }
        return Optional.empty();
    }
}
