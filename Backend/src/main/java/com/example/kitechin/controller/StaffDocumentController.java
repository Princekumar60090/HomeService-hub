package com.example.kitechin.controller;

import com.example.kitechin.entity.Staff;
import com.example.kitechin.repository.StaffRepository;
import com.example.kitechin.service.FileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/staff/docs")
@RequiredArgsConstructor
@Tag(name="Staff Document APIs")
public class StaffDocumentController {

    private final StaffRepository staffRepository;
    private final FileService fileService;

    // Upload Documents (Profile Pic + Aadhar)
    @PostMapping(value = "/upload/{staffId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Staff uploadDocuments(@PathVariable String staffId,
                                 @RequestParam(value = "profilePic", required = false) MultipartFile profilePic,
                                 @RequestParam(value = "identityProof", required = false) MultipartFile identityProof) throws IOException {

        Staff staff = staffRepository.findById(new ObjectId(staffId))
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (profilePic != null && !profilePic.isEmpty()) {
            String profileFilename = fileService.uploadFile(profilePic);
            staff.setProfilePicture(profileFilename);
        }

        if (identityProof != null && !identityProof.isEmpty()) {
            String identityFilename = fileService.uploadFile(identityProof);
            staff.setIdentityProof(identityFilename);
        }

        return staffRepository.save(staff);
    }

    // View Profile Picture (Public)
    @GetMapping(value = "/image/{filename}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getProfileImage(@PathVariable String filename) throws IOException {
        byte[] image = fileService.getFile(filename);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
    }

    // View PDF/Identity Proof (In real world, secure this with @PreAuthorize("hasRole('ADMIN')"))
    @GetMapping(value = "/identity/{filename}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getIdentityProof(@PathVariable String filename) throws IOException {
        byte[] file = fileService.getFile(filename);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(file);
    }
}