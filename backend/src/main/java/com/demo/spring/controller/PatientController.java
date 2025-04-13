package com.demo.spring.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.demo.spring.model.Appointment;
import com.demo.spring.model.Patient;
import com.demo.spring.service.AppointmentService;
import com.demo.spring.service.PatientService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173") 
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/register")
    public Patient registerPatient(@RequestBody Patient patient) {
        return patientService.registerPatient(patient);
    }

    @PostMapping("/login")
    public Optional<Patient> loginPatient(@RequestBody Patient patient) {
        return patientService.loginPatient(patient.getUsername(), patient.getPassword());
    }

    @GetMapping("/check-username/{username}")
    public Map<String, Boolean> checkUsername(@PathVariable String username) {
        boolean available = patientService.checkUsernameAvailability(username);
        return Map.of("available", available);
    }

    @GetMapping("/{id}")
    public Optional<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @PutMapping("/{id}")
    public Patient updatePatientProfile(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatientProfile(id, patient);
    }

    @GetMapping("/{username}/appointments")
    public List<Appointment> getPatientAppointments(@PathVariable String username) {
        return appointmentService.getAppointmentsByPatient(username);
    }

    @PostMapping("/appointments")
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @DeleteMapping("/appointments/{id}")
    public void cancelAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
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

            String result = patientService.resetPasswordByUsername(username, securityAnswer, newPassword);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}