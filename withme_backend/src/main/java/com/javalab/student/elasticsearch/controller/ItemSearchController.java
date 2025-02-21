package com.javalab.student.elasticsearch.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;
import com.javalab.student.elasticsearch.service.ItemSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemSearchController {

    private final ItemSearchService searchService;

    @PostMapping("/reindex")
    public ResponseEntity<String> reindexAll() {
        searchService.indexAllItems();
        return ResponseEntity.ok("Indexing completed");
    }

    // 상품명, 상품설명, 알러지 검색
    @GetMapping("/search")
    public ResponseEntity<List<ItemSearchDocument>> search(@RequestParam String keyword) {
    return ResponseEntity.ok(searchService.searchItems(keyword));
    }
}
