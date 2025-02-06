package com.javalab.student;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.javalab.student.repository")
public class WithmeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(WithmeBackendApplication.class, args);
    }
}

