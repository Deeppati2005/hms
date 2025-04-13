package com.demo.spring.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Admin {
    
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
    @Id
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;

    private String securityQuestion;
    private String securityAnswer;
}