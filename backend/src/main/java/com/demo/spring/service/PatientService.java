package com.demo.spring.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.demo.spring.model.Patient;
import com.demo.spring.repository.PatientRepository;



import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient registerPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Optional<Patient> loginPatient(String username, String password) {
        return patientRepository.findByUsername(username)
                .filter(patient -> patient.getPassword().equals(password));
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

//    public boolean checkUsernameAvailability(String username) {
//        return !patientRepository.existsByUsername(username);
//    }
    
    public boolean checkUsernameAvailability(String username) {
        return !patientRepository.existsByUsername(username); // Returns true if username is available
    }

    public Patient updatePatientProfile(Long id, Patient updatedPatient) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setName(updatedPatient.getName());
        patient.setEmail(updatedPatient.getEmail());
        patient.setPhone(updatedPatient.getPhone());
        return patientRepository.save(patient);
    }
    
    public String resetPasswordByUsername(String username, String securityAnswer, String newPassword) {
        Patient patient = patientRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate security answer
        if (!patient.getSecurityAnswer().equalsIgnoreCase(securityAnswer)) {
            throw new RuntimeException("Security answer incorrect");
        }

        // Update password
        patient.setPassword(newPassword);
        patientRepository.save(patient);

        return "Password reset successfully";
    }
    
    @Transactional
    public void deletePatientByUsername(String username) {
        if (!patientRepository.existsByUsername(username)) {
            throw new RuntimeException("Patient not found");
        }
        patientRepository.deleteByUsername(username);
    }
}