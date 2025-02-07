package com.javalab.student.entity;

import com.javalab.student.constant.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


/**
 * 의사 신청 엔티티
 * - 사용자가 의사 신청을 할 때 저장되는 엔티티
 */
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "doctor_application")
public class DoctorApplication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId; // 신청 ID

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "user_id", nullable = false)  // 외래키 설정
    private Member member;

    @Column(name = "doctor_number", length = 50)
    private String doctorNumber; // 면허번호

    @Column(name = "subject", length = 50)
    private String subject; // 담당과목

    @Column(name = "hospital", length = 255)
    private String hospital; // 병원정보

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDING;  // 기본값 PENDING

    @Column
    private String reason; // 거절 사유

}
