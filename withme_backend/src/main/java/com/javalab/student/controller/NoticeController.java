package com.javalab.student.controller;

import com.javalab.student.entity.Notice;
import com.javalab.student.repository.NoticeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    // 생성자를 통해 Repository 주입
    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 공지사항 등록 (POST)
    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        notice.setCreatedAt(LocalDateTime.now()); // 생성 시간 설정
        return ResponseEntity.ok(noticeRepository.save(notice)); // 저장 후 반환
    }

    // 공지사항 수정 (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice updatedNotice) {
        return noticeRepository.findById(id).map(notice -> {
            notice.setTitle(updatedNotice.getTitle());
            notice.setContent(updatedNotice.getContent());
            notice.setCategory(updatedNotice.getCategory());
            notice.setUpdatedAt(LocalDateTime.now()); // 수정 시간 설정
            return ResponseEntity.ok(noticeRepository.save(notice)); // 수정 후 저장
        }).orElse(ResponseEntity.notFound().build()); // 공지사항이 없으면 404 반환
    }

    // 공지사항 삭제 (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        return noticeRepository.findById(id).map(notice -> {
            noticeRepository.delete(notice); // 공지사항 삭제
            return ResponseEntity.ok().<Void>build(); // 명시적으로 Void 타입 설정
        }).orElse(ResponseEntity.notFound().build()); // 공지사항이 없으면 404 반환
    }

    // 공지사항 조회 (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Long id) {
        return noticeRepository.findById(id)
                .map(ResponseEntity::ok) // 공지사항이 있으면 반환
                .orElse(ResponseEntity.notFound().build()); // 없으면 404 반환
    }

    // 모든 공지사항 조회 (GET)
    @GetMapping
    public ResponseEntity<Iterable<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeRepository.findAll()); // 모든 공지사항 반환
    }
}
