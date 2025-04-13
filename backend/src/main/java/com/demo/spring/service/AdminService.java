package com.demo.spring.service;

import com.demo.spring.model.Admin;
import com.demo.spring.model.Appointment;
import com.demo.spring.model.Doctor;
import com.demo.spring.model.Patient;
import com.demo.spring.repository.AdminRepository;
import com.demo.spring.repository.AppointmentRepository;
import com.demo.spring.repository.DoctorRepository;
import com.demo.spring.repository.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;


    public Admin registerAdmin(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        return adminRepository.save(admin);
    }

    public Optional<Admin> loginAdmin(String username, String password) {
        return adminRepository.findByUsername(username)
                .filter(admin -> admin.getPassword().equals(password));
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public boolean checkUsernameAvailability(String username) {
        return !adminRepository.existsByUsername(username);
    }

    public String resetPasswordByUsername(String username, String securityAnswer, String newPassword) {
    	Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!admin.getSecurityAnswer().equalsIgnoreCase(securityAnswer)) {
            throw new RuntimeException("Security answer incorrect");
        }

        admin.setPassword(newPassword);
        adminRepository.save(admin);

        return "Password reset successfully";
    }
    
    public Admin getAdminProfile() {
        return adminRepository.findAll().get(0);
    }

    public Admin updateAdminProfile(Admin updatedAdmin) {
        Admin existingAdmin = adminRepository.findByUsername(updatedAdmin.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        existingAdmin.setName(updatedAdmin.getName());
        existingAdmin.setEmail(updatedAdmin.getEmail());
        existingAdmin.setPhone(updatedAdmin.getPhone());
        existingAdmin.setSecurityQuestion(updatedAdmin.getSecurityQuestion());
        existingAdmin.setSecurityAnswer(updatedAdmin.getSecurityAnswer());
        if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isEmpty()) {
            existingAdmin.setPassword(updatedAdmin.getPassword());
        }
        return adminRepository.save(existingAdmin);
    }

    public void logoutAdmin() {
    }

    public Map<String, String> updateDoctorStatus(Long id, String status) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus(status);
        doctorRepository.save(doctor);
        return Map.of("id", doctor.getId().toString(), "status", doctor.getStatus(), "message", "Status updated successfully");
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}