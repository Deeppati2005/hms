package com.demo.spring.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.spring.model.Doctor;
import com.demo.spring.repository.DoctorRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor registerDoctor(Doctor doctor) {
    	doctor.setStatus("pending");
        return doctorRepository.save(doctor);
    }

    public Optional<Doctor> loginDoctor(String username, String password) {
        return doctorRepository.findByUsername(username)
                .filter(doctor -> doctor.getPassword().equals(password));
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }
    
    public boolean checkUsernameAvailability(String username) {
        return !doctorRepository.existsByUsername(username); // Returns true if username is available
    }
    
    public Map<String, Object> checkDoctorStatus(String username) {
        Optional<Doctor> doctor = doctorRepository.findByUsername(username);
        if (doctor.isPresent()) {
            return Map.of(
                "approved", "approved".equals(doctor.get().getStatus()),
                "status", doctor.get().getStatus()
            );
        } else {
            throw new RuntimeException("Doctor not found");
        }
    }

    public Doctor updateDoctorProfile(Long id, Doctor updatedDoctor) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setName(updatedDoctor.getName());
        doctor.setEmail(updatedDoctor.getEmail());
        doctor.setPhone(updatedDoctor.getPhone());
        doctor.setSpecialty(updatedDoctor.getSpecialty());
        doctor.setExperience(updatedDoctor.getExperience());
        return doctorRepository.save(doctor);
    }
    
    public String resetPasswordByUsername(String username, String securityAnswer, String newPassword) {
    	Doctor doctor = doctorRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate security answer
        if (!doctor.getSecurityAnswer().equalsIgnoreCase(securityAnswer)) {
            throw new RuntimeException("Security answer incorrect");
        }

        // Update password
        doctor.setPassword(newPassword);
        doctorRepository.save(doctor);

        return "Password reset successfully";
    }
}