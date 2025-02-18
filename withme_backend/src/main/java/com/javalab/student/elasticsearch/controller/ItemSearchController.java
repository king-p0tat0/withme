package com.javalab.student.elasticsearch.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;
import com.javalab.student.elasticsearch.service.ItemSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class ItemSearchController {
    private final ItemSearchService searchService;

    @GetMapping
    public List<ItemSearchDocument> search(@RequestParam String keyword) {
        return searchService.searchItems(keyword);
    }

    @GetMapping("/category")
    public List<ItemSearchDocument> searchByCategory(
            @RequestParam String keyword,
            @RequestParam String category) {
        return searchService.searchByCategory(keyword, category);
    }
}