package com.demo.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.spring.model.Appointment;
import com.demo.spring.service.AppointmentService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

	@Autowired
	private AppointmentService appointmentService;

	@GetMapping
	public List<Appointment> getAllAppointments() {
		return appointmentService.getAllAppointments();
	}

	@GetMapping("/{id}")
	public Optional<Appointment> getAppointmentById(@PathVariable Long id) {
		return appointmentService.getAppointmentById(id);
	}

	@PostMapping
	public Appointment createAppointment(@RequestBody Appointment appointment) {
		return appointmentService.createAppointment(appointment);
	}

	@PutMapping("/{id}")
	public Appointment updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
		return appointmentService.updateAppointment(id, appointment);
	}

	@DeleteMapping("/{id}")
	public void deleteAppointment(@PathVariable Long id) {
		appointmentService.deleteAppointment(id);
	}

	@GetMapping("/available-slots")
	public List<String> getAvailableSlots(@RequestParam String doctorUsername, @RequestParam String date) {
	    return appointmentService.getAvailableSlots(doctorUsername, date);
	}
}