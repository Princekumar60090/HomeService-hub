package com.example.kitechin.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {

    // Ideally, this path comes from application.properties
    private final String UPLOAD_DIR = "uploads/";

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        // 1. Create directory if it doesn't exist
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 2. Generate a unique filename (Real World Best Practice)
        // Original: "my-photo.jpg" -> Generated: "550e8400-e29b-41d4... .jpg"
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + extension;

        // 3. Save the file to the target path
        Path targetPath = Paths.get(UPLOAD_DIR + newFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return newFilename;
    }

    // Helper to retrieve the file path for downloading/viewing
    public byte[] getFile(String filename) throws IOException {
        Path path = Paths.get(UPLOAD_DIR + filename);
        return Files.readAllBytes(path);
    }
}