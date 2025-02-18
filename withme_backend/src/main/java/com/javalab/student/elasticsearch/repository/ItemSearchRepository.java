package com.javalab.student.elasticsearch.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;

public interface ItemSearchRepository extends ElasticsearchRepository<ItemSearchDocument, String> {
    List<ItemSearchDocument> findByNameOrDescriptionContaining(String keyword);
    List<ItemSearchDocument> findByNameOrDescriptionContainingAndCategory(String keyword, String category);
}