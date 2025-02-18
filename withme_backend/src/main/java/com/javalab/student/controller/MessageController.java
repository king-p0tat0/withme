package com.javalab.student.controller;

import com.javalab.student.dto.MessageRequestDto;
import com.javalab.student.dto.MessageResponseDto;
import com.javalab.student.service.MessageService;
import com.javalab.student.service.MessagePublisherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;
    private final MessagePublisherService messagePublisherService;

    /**
     * 사용자가 보낸 메시지 조회
     */
    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<MessageResponseDto>> getSentMessages(@PathVariable("userId") Long userId) {
        log.info("📨 보낸 메시지 조회 요청 - userId: {}", userId);
        List<MessageResponseDto> sentMessages = messageService.getSentMessages(userId);
        return ResponseEntity.ok(sentMessages);
    }

    /**
     * 사용자가 받은 메시지 조회
     */
    @GetMapping("/received/{userId}")
    public ResponseEntity<List<MessageResponseDto>> getReceivedMessages(@PathVariable("userId") Long userId) {
        log.info("📨 받은 메시지 조회 요청 - userId: {}", userId);
        List<MessageResponseDto> receivedMessages = messageService.getReceivedMessages(userId);
        return ResponseEntity.ok(receivedMessages);
    }

    /**
     * 사용자의 읽지 않은 메시지 개수 조회
     */
    @GetMapping("/unread/{userId}")
    public ResponseEntity<Integer> getUnreadMessageCount(@PathVariable("userId") Long userId) {
        log.info("🔢 읽지 않은 메시지 개수 조회 요청 - userId: {}", userId);
        int unreadCount = messageService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(unreadCount);
    }

    /**
     * 메시지를 읽음 처리
     */
    @PostMapping("/read")
    public ResponseEntity<Void> markMessageAsRead(@RequestParam Long messageId) {
        log.info("📖 메시지 읽음 처리 요청 - messageId: {}", messageId);
        messageService.markMessageAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    /**
     * 메시지 전송
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@Valid @RequestBody MessageRequestDto requestDto) {
        log.info("📨 메시지 전송 요청: senderId={}, receiverId={}, content={}",
                requestDto.getSenderId(), requestDto.getReceiverId(), requestDto.getContent());

        try {
            // 메시지 저장 및 발행
            MessageResponseDto savedMessage = messageService.saveMessage(requestDto);

            // Redis 메시지 발행 (선택적)
            messagePublisherService.publishMessage(
                    requestDto.getReceiverId(),
                    requestDto.getSenderId(),
                    savedMessage.getContent()
            );

            // JSON 응답 구성
            Map<String, Object> response = new HashMap<>();
            response.put("messageId", savedMessage.getId());
            response.put("content", savedMessage.getContent());
            response.put("status", "success");
            response.put("message", "메시지 전송 성공");

            log.info("✅ 메시지 전송 성공 - messageId={}, content={}",
                    savedMessage.getId(), savedMessage.getContent());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("🚨 메시지 전송 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "메시지 전송 실패", "details", e.getMessage()));
        }
    }

    /**
     * 사용자가 받은 메시지 조회 (페이지네이션)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Page<MessageResponseDto>> getMessages(
            @PathVariable("userId") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("📨 메시지 리스트 조회 요청 - userId: {}, page: {}, size: {}", userId, page, size);
        Page<MessageResponseDto> messages = messageService.getMessagesByUserId(userId, page, size);
        return ResponseEntity.ok(messages);
    }

    /**
     * 특정 사용자와의 대화 메시지 조회
     */
    @GetMapping("/conversation")
    public ResponseEntity<List<MessageResponseDto>> getConversation(
            @RequestParam Long userId,
            @RequestParam Long targetUserId) {
        log.info("🔍 대화 조회 요청 - userId={}, targetUserId={}", userId, targetUserId);
        List<MessageResponseDto> conversation = messageService.getConversation(userId, targetUserId);
        return ResponseEntity.ok(conversation);
    }

    /**
     * 메시지 편집
     */
    @PutMapping("/{messageId}")
    public ResponseEntity<MessageResponseDto> editMessage(
            @PathVariable Long messageId,
            @RequestBody String newContent) {
        log.info("✏️ 메시지 편집 요청 - messageId: {}, newContent: {}", messageId, newContent);
        MessageResponseDto editedMessage = messageService.editMessage(messageId);
        return ResponseEntity.ok(editedMessage);
    }

    /**
     * 메시지 삭제
     */
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId,
            @RequestParam Long userId,
            @RequestParam boolean isSender) {
        log.info("🗑️ 메시지 삭제 요청 - messageId: {}, userId: {}, isSender: {}", messageId, userId, isSender);
        messageService.deleteMessage(messageId, userId, isSender);
        return ResponseEntity.ok().build();
    }
}