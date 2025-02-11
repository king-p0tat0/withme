package com.javalab.student.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.javalab.student.dto.NoticeDto;
import com.javalab.student.entity.Notice;
import com.javalab.student.service.NoticeService;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    //공지사항 목록
    @GetMapping
    public ResponseEntity<List<NoticeDto>> getAllNotices() {
        List<NoticeDto> notices = noticeService.getAllNotices(); 
        return ResponseEntity.ok(notices);
    }

    //공지사항 상세
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> getNoticeById(@PathVariable Long id) {
        NoticeDto notice = noticeService.getNoticeById(id); 
        return ResponseEntity.ok(notice);
    }

    //공지사항 등록
    @PostMapping
    public ResponseEntity<NoticeDto> createNotice(@RequestBody NoticeDto noticeDto) {
        NoticeDto createdNotice = noticeService.createNotice(noticeDto); 
        return ResponseEntity.ok(createdNotice);
    }

    //공지사항 수정
    @PutMapping("/{id}")
    public ResponseEntity<NoticeDto> updateNotice(@PathVariable Long id, @RequestBody NoticeDto noticeDto) {
        NoticeDto updatedNotice = noticeService.updateNotice(id, noticeDto); 
        return ResponseEntity.ok(updatedNotice);
    }

    //공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id); 
        return ResponseEntity.noContent().build();
    }
}
