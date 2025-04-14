package com.demo.spring.service;


import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.spring.model.Appointment;
import com.demo.spring.repository.AppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
    	appointment.setStatus("pending");
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorUsername) {
        return appointmentRepository.findByDoctorUsername(doctorUsername);
    }

    public List<Appointment> getAppointmentsByPatient(String patientUsername) {
        return appointmentRepository.findByPatientUsername(patientUsername);
    }

    public Appointment updateAppointment(Long id, Appointment updatedAppointment) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setDate(updatedAppointment.getDate());
        appointment.setTime(updatedAppointment.getTime());
        appointment.setStatus(updatedAppointment.getStatus());
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
    
    public List<String> getAvailableSlots(String doctorUsername, String date) {
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(17, 0);
        int slotDurationMinutes = 30; 
        List<String> allSlots = new ArrayList<>();
        LocalTime currentTime = startTime;
        while (currentTime.isBefore(endTime)) {
            allSlots.add(currentTime.toString());
            currentTime = currentTime.plusMinutes(slotDurationMinutes);
        }
        List<Appointment> appointments = appointmentRepository.findByDoctorUsernameAndDate(doctorUsername, date);

        List<String> bookedSlots = appointments.stream()
                .map(Appointment::getTime)
                .collect(Collectors.toList());

        // Filter out booked slots from all slots
        allSlots.removeAll(bookedSlots);

        return allSlots;
    }
}