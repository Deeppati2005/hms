package com.demo.spring.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String specialty;
    private Integer experience;
    private String securityQuestion;
    private String securityAnswer;
    private String status; // "approved", "pending", "rejected"
}