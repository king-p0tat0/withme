package com.javalab.student.controller;

import com.javalab.student.dto.NoticeDto;
import com.javalab.student.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // 공지사항 등록 (관리자만 가능)
    // @PostMapping
    // public ResponseEntity<NoticeDto> createNotice(@RequestBody NoticeDto noticeDto) {
    //     return ResponseEntity.ok(noticeService.createNotice(noticeDto));
    // }

    @PostMapping
public ResponseEntity<NoticeDto> createNotice(@RequestBody NoticeDto noticeDto) {
    return ResponseEntity.ok(noticeService.createNotice(noticeDto));
}

    // 공지사항 수정 (관리자만 가능)
    @PutMapping("/{id}")
    public ResponseEntity<NoticeDto> updateNotice(@PathVariable Long id, @RequestBody NoticeDto noticeDto) {
        return ResponseEntity.ok(noticeService.updateNotice(id, noticeDto));
    }

    // 공지사항 삭제 (관리자만 가능)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    // 단일 공지사항 조회 (모든 사용자 가능)
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> getNoticeById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getNoticeById(id));
    }

    // 모든 공지사항 조회 (모든 사용자 가능)
    @GetMapping
    public ResponseEntity<List<NoticeDto>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }
}
