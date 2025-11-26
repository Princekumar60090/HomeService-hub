package com.example.kitechin.service;

import com.example.kitechin.entity.Admin;
import com.example.kitechin.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin register(Admin admin) {
        return adminRepository.save(admin);
    }


    public Optional<Admin> login(String email, String password) {
        Optional<Admin> existing = adminRepository.findByEmail(email);
        if (existing.isPresent() && existing.get().getPassword().equals(password)) {
            return existing;
        }
        return Optional.empty();
    }
}
