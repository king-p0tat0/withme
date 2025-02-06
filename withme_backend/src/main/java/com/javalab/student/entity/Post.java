package com.javalab.student.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "posts")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor // 모든 필드를 포함하는 생성자
@Builder // 빌더 패턴 활성화
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private long postId;

    @Column(name = "user_id", nullable = false, length = 20)
    private String userId;

    @Column(name = "post_title", nullable = false, length = 100)
    private String postTitle;

    @Column(name = "post_content", nullable = false, columnDefinition = "TEXT")
    private String postContent;

    @Column(name = "points_earned")
    private Integer pointsEarned;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "view_count", nullable = false)
    private int viewCount;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Comment> comments;
}

