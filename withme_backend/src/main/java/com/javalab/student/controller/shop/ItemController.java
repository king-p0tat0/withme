package com.javalab.student.controller.shop;


import com.javalab.student.constant.ItemSellStatus;
import com.javalab.student.dto.shop.ItemDto;
import com.javalab.student.dto.shop.ItemFormDto;
import com.javalab.student.dto.shop.ItemSearchDto;
import com.javalab.student.entity.Doctor;
import com.javalab.student.entity.shop.Item;
import com.javalab.student.service.shop.ItemService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 상품 관련 컨트롤러
 * - /item/list : 판매중인 상품 목록 조회
 * - /item/new : 상품 등록
 * - /item/view/{itemId} : 상품 상세 조회
 * - /item/edit/{itemId} : 상품 수정
 * - /item/delete/{itemId} : 상품 삭제
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/item")
@Log4j2
public class ItemController {

    private final ItemService itemService;


    /**
     * 판매중인 상품 목록 페이지
     */
    @GetMapping("/list")
    public ResponseEntity<List<ItemFormDto>> getItemList() {
        return ResponseEntity.ok(itemService.getItemListByItemSellStatus(ItemSellStatus.SELL));
    }


    /**
     * 상품 등록 API
     * BindingResult : 유효성 검사 결과
     */
    @PostMapping("/new")
    public ResponseEntity<?> createItem(@Valid @RequestPart("itemFormDto") ItemFormDto itemFormDto,
                                        @RequestPart("itemImgFile") List<MultipartFile> itemImgFileList) {
        try {
            Long savedItemId = itemService.saveItem(itemFormDto, itemImgFileList);
            return ResponseEntity.ok().body(savedItemId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("상품 등록 실패: " + e.getMessage());
        }
    }







    /**
     * 상품 상세 조회 API
     */
    @GetMapping("/view/{itemId}")
    public ResponseEntity<?> getItemDetail(@PathVariable("itemId") Long itemId) {
        try {
            ItemFormDto itemFormDto = itemService.getItemDetail(itemId);
            return ResponseEntity.ok(itemFormDto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 상품입니다.");
        }
    }


    /**
     * 상품 수정 API
     */
    @PutMapping("/edit/{itemId}")
    public ResponseEntity<?> updateItem(@PathVariable("itemId") Long itemId,
                                        @Valid @RequestBody ItemFormDto itemFormDto,
                                        BindingResult bindingResult,
                                        @RequestParam("itemImgFile") List<MultipartFile> itemImgFileList) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("입력값이 유효하지 않습니다.");
        }

        if (itemImgFileList.get(0).isEmpty() && itemFormDto.getId() == null) {
            return ResponseEntity.badRequest().body("첫번째 상품 이미지는 필수 입력 값입니다.");
        }

        itemImgFileList = itemImgFileList.stream()
                .filter(file -> !file.isEmpty())
                .toList();

        try {
            itemService.updateItem(itemFormDto, itemImgFileList);
            return ResponseEntity.ok("상품이 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 수정 중 에러가 발생하였습니다.");
        }
    }

    /**
     * 상품 삭제 API
     */
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable("itemId") Long itemId) {
        try {
            itemService.delete(itemId);  // 서비스 레벨에서 상품 삭제 로직 수행
            return ResponseEntity.ok("상품이 삭제되었습니다.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 상품입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 삭제 중 에러가 발생했습니다.");
        }
    }


}
