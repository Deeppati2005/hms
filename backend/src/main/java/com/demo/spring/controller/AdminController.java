package com.demo.spring.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.spring.model.Admin;
import com.demo.spring.model.Appointment;
import com.demo.spring.model.Doctor;
import com.demo.spring.model.Patient;
import com.demo.spring.service.AdminService;
import com.demo.spring.service.PatientService;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminService.registerAdmin(admin);
    }

    @PostMapping("/login")
    public Optional<Admin> loginAdmin(@RequestBody Admin admin) {
        return adminService.loginAdmin(admin.getUsername(), admin.getPassword());
    }

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/{username}")
    public Optional<Admin> findByUsername(@PathVariable String username) {
        return adminService.findByUsername(username);
    }

    @GetMapping("/check-username/{username}")
    public boolean checkUsernameAvailability(@PathVariable String username) {
        return adminService.checkUsernameAvailability(username);
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

            String result = adminService.resetPasswordByUsername(username, securityAnswer, newPassword);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Admin> getAdminProfile() {
        Admin admin = adminService.getAdminProfile();
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/profile")
    public ResponseEntity<Admin> updateAdminProfile(@RequestBody Admin admin) {
        Admin updatedAdmin = adminService.updateAdminProfile(admin);
        return ResponseEntity.ok(updatedAdmin);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutAdmin() {
        adminService.logoutAdmin();
        return ResponseEntity.ok("Admin logged out successfully");
    }

    @PutMapping("/doctors/{id}/status")
    public ResponseEntity<Map<String, String>> updateDoctorStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        String status = statusRequest.get("status");
        Map<String, String> response = adminService.updateDoctorStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = adminService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = adminService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = adminService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
   
    @DeleteMapping("/patients/{username}")
    public ResponseEntity<String> deletePatient(@PathVariable String username) {
        try {
            patientService.deletePatientByUsername(username);
            return ResponseEntity.ok("Patient deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}