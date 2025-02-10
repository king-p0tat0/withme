package com.javalab.withme.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "comments")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(name = "user_id", nullable = false, length = 20)
    private Long userId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    // 댓글에 댓글을 달기 위한 부모 댓글 설정 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    // 자식 댓글 리스트 (1:N 관계)
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> childComments;
}
