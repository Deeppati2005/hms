package com.demo.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.demo.spring.model.Appointment;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorUsername(String doctorUsername);
    List<Appointment> findByPatientUsername(String patientUsername);

    @Query("SELECT a FROM Appointment a WHERE a.doctorUsername = :doctorUsername AND a.date = :date")
    List<Appointment> findByDoctorUsernameAndDate(@Param("doctorUsername") String doctorUsername, @Param("date") String date);
}