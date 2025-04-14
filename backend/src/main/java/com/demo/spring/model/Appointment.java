package com.demo.spring.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String doctorUsername;
    private String patientUsername;
    private String date;
    private String time;
    private String status; // "confirmed", "cancelled", "completed","pending"
//    private String notes;
}