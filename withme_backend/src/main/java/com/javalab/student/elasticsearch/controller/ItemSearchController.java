//package com.javalab.student.elasticsearch.controller;
//
//import java.util.List;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.javalab.student.elasticsearch.document.ItemSearchDocument;
//import com.javalab.student.elasticsearch.service.ItemSearchService;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/items")
//@RequiredArgsConstructor
//public class ItemSearchController {
//    private final ItemSearchService searchService;
//
//    // 일반 검색
//    @GetMapping("/search")
//    public ResponseEntity<List<ItemSearchDocument>> search(@RequestParam String keyword) {
//        return ResponseEntity.ok(searchService.searchItems(keyword));
//    }
//
//    // @GetMapping("/search")
//    // public List<ItemSearchDocument> searchItems(
//    //     @RequestParam(value = "keyword", required = false) String keyword
//    // ) {
//    //     return itemSearchService.searchItems(keyword);
//    // }
//
//    // 반려동물 알러지 기반 필터링된 상품 목록
//    @GetMapping("/filter/{petId}")
//    public ResponseEntity<List<ItemSearchDocument>> getAllergyFilteredItems(
//            @PathVariable Long petId) {
//        return ResponseEntity.ok(searchService.getAllergyFilteredItems(petId));
//    }
//
//    // 검색어와 반려동물 알러지 모두 적용된 검색
//    @GetMapping("/search/pet/{petId}")
//    public ResponseEntity<List<ItemSearchDocument>> searchWithAllergyFilter(
//            @RequestParam String keyword,
//            @PathVariable Long petId) {
//        return ResponseEntity.ok(searchService.searchItemsWithAllergyFilter(keyword, petId));
//    }
//}