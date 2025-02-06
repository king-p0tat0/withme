package com.javalab.student;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.javalab.student")
@EntityScan(basePackages = "com.javalab.student.entity")  // 엔티티 패키지 명시
@EnableJpaRepositories(basePackages = "com.javalab.student.repository")  // JPA 리포지토리 패키지 명시
public class WithmeBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(WithmeBackendApplication.class, args);
    }
}

