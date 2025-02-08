package com.javalab.student.service;

import com.javalab.student.dto.NoticeDto;
import com.javalab.student.entity.Notice;
import com.javalab.student.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    // 공지사항 등록
    public NoticeDto createNotice(NoticeDto noticeDto) {
        Notice notice = new Notice();
        notice.setTitle(noticeDto.getTitle());
        notice.setContent(noticeDto.getContent());
        notice.setCategory(noticeDto.getCategory());
        notice.setCreatedAt(LocalDateTime.now());
        Notice savedNotice = noticeRepository.save(notice);
        return mapToDto(savedNotice);
    }

    // 공지사항 수정
    public NoticeDto updateNotice(Long id, NoticeDto noticeDto) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        notice.setTitle(noticeDto.getTitle());
        notice.setContent(noticeDto.getContent());
        notice.setCategory(noticeDto.getCategory());
        notice.setUpdatedAt(LocalDateTime.now());
        Notice updatedNotice = noticeRepository.save(notice);
        return mapToDto(updatedNotice);
    }

    // 공지사항 삭제
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        noticeRepository.delete(notice);
    }

    // 공지사항 단건 조회
    public NoticeDto getNoticeById(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        return mapToDto(notice);
    }

    // 모든 공지사항 조회 (긴급 공지는 상단에 고정)
    public List<NoticeDto> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream()
                .sorted((n1, n2) -> {
                    if ("긴급 공지".equals(n1.getCategory()) && !"긴급 공지".equals(n2.getCategory())) {
                        return -1; // 긴급 공지는 상단으로 이동
                    } else if (!"긴급 공지".equals(n1.getCategory()) && "긴급 공지".equals(n2.getCategory())) {
                        return 1;
                    }
                    return n2.getCreatedAt().compareTo(n1.getCreatedAt()); // 최신순 정렬
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 엔티티를 DTO로 변환하는 메서드
    private NoticeDto mapToDto(Notice notice) {
        NoticeDto dto = new NoticeDto();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setContent(notice.getContent());
        dto.setCategory(notice.getCategory());
        dto.setCreatedAt(notice.getCreatedAt());
        dto.setUpdatedAt(notice.getUpdatedAt());
        return dto;
    }
}
