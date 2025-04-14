package com.demo.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.demo.spring.model.Doctor;
import com.demo.spring.service.DoctorService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/register")
    public Doctor registerDoctor(@RequestBody Doctor doctor) {
        return doctorService.registerDoctor(doctor);
    }

    @PostMapping("/login")
    public Optional<Doctor> loginDoctor(@RequestBody Doctor doctor) {
        return doctorService.loginDoctor(doctor.getUsername(), doctor.getPassword());
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Optional<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @GetMapping("/check-username/{username}")
    public Map<String, Boolean> checkUsername(@PathVariable String username) {
        boolean available = doctorService.checkUsernameAvailability(username);
        return Map.of("available", available);
    }

    @PutMapping("/{username}")
    public ResponseEntity<Doctor> updateDoctorProfile(@PathVariable String username, @RequestBody Doctor updatedDoctor) {
        try {
            Doctor doctor = doctorService.updateDoctorProfileByUsername(username, updatedDoctor);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/check-status")
    public Map<String, Object> checkDoctorStatus(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        if (username == null || username.isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        return doctorService.checkDoctorStatus(username);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String securityAnswer = request.get("securityAnswer");
            String newPassword = request.get("newPassword");

            if (username == null || securityAnswer == null || newPassword == null) {
                throw new RuntimeException("All fields are required");
            }

            String result = doctorService.resetPasswordByUsername(username, securityAnswer, newPassword);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logoutDoctor() {
        doctorService.logoutDoctor();
        return ResponseEntity.ok("Admin logged out successfully");
    }
}