package com.javalab.student.elasticsearch.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;
import com.javalab.student.elasticsearch.repository.ItemSearchRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemSearchService {
    private final ItemSearchRepository searchRepository;

    public List<ItemSearchDocument> searchItems(String keyword) {
        return searchRepository.findByNameOrDescriptionContaining(keyword);
    }

    public List<ItemSearchDocument> searchByCategory(String keyword, String category) {
        return searchRepository.findByNameOrDescriptionContainingAndCategory(keyword, category);
    }
}