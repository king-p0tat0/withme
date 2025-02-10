package com.javalab.withme.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.javalab.withme.dto.NoticeDto;
import com.javalab.withme.entity.Notice;
import com.javalab.withme.repository.NoticeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    // Create a new notice (DTO -> Entity)
    public NoticeDto createNotice(NoticeDto noticeDto) {
        Notice notice = mapToEntity(noticeDto); // Convert DTO to Entity
        notice.setCreatedAt(LocalDateTime.now());
        Notice savedNotice = noticeRepository.save(notice);
        return mapToDto(savedNotice); // Convert Entity back to DTO
    }

    // Update an existing notice (DTO -> Entity)
    public NoticeDto updateNotice(Long id, NoticeDto noticeDto) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        
        // Update entity fields from DTO
        notice.setTitle(noticeDto.getTitle());
        notice.setContent(noticeDto.getContent());
        notice.setCategory(noticeDto.getCategory());
        notice.setUpdatedAt(LocalDateTime.now());

        Notice updatedNotice = noticeRepository.save(notice);
        return mapToDto(updatedNotice); // Convert Entity back to DTO
    }

    // Delete a notice by ID
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        noticeRepository.delete(notice);
    }

    // Get a single notice by ID (Entity -> DTO)
    public NoticeDto getNoticeById(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        return mapToDto(notice); // Convert Entity to DTO
    }

    // Get all notices (Entities -> DTOs)
    public List<NoticeDto> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        
        // Sort notices (e.g., "긴급 공지" first, then by creation date)
        return notices.stream()
                .sorted((n1, n2) -> {
                    if ("긴급 공지".equals(n1.getCategory()) && !"긴급 공지".equals(n2.getCategory())) {
                        return -1;
                    } else if (!"긴급 공지".equals(n1.getCategory()) && "긴급 공지".equals(n2.getCategory())) {
                        return 1;
                    }
                    return n2.getCreatedAt().compareTo(n1.getCreatedAt());
                })
                .map(this::mapToDto) // Convert each entity to a DTO
                .collect(Collectors.toList());
    }

    // Helper method: Convert Entity to DTO
    private NoticeDto mapToDto(Notice notice) {
        return new NoticeDto(
            notice.getId(),
            notice.getTitle(),
            notice.getContent(),
            notice.getCategory(),
            notice.getCreatedAt(),
            notice.getUpdatedAt()
        );
    }

    // Helper method: Convert DTO to Entity
    private Notice mapToEntity(NoticeDto dto) {
        return new Notice(
            dto.getId(),
            dto.getTitle(),
            dto.getContent(),
            dto.getCategory(),
            dto.getCreatedAt(),
            dto.getUpdatedAt()
        );
    }
}
