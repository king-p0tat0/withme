package com.javalab.student.elasticsearch.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.javalab.student.elasticsearch.document.ItemSearchDocument;
import com.javalab.student.elasticsearch.repository.ItemSearchRepository;
import com.javalab.student.entity.shop.Item;
import com.javalab.student.entity.shop.ItemSubstance;
import com.javalab.student.repository.SubstanceRepository;
import com.javalab.student.repository.shop.ItemRepository;
import com.javalab.student.repository.shop.ItemSubstanceRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemSearchService {
    private final ItemSearchRepository searchRepository;
    private final ItemRepository itemRepository;
    private final ItemSubstanceRepository itemSubstanceRepository;
    private final SubstanceRepository substanceRepository;
    private final ElasticsearchOperations operations;

    @PostConstruct  // 애플리케이션 시작시 자동 실행
    @Transactional
    public void initIndex() {
        try {
            // 기존 인덱스 삭제
            IndexOperations indexOps = operations.indexOps(ItemSearchDocument.class);
            if (indexOps.exists()) {
                indexOps.delete();
                log.info("Deleted existing search index");
            }

            // 새 인덱스 생성 및 데이터 색인
            indexAllItems();
        } catch (Exception e) {
            log.error("Error during index initialization: ", e);
        }
    }

    @Transactional
    public void indexAllItems() {
        try {
            log.info("Starting full indexing process");
            List<Item> items = itemRepository.findAll();
            log.info("Found {} items to index", items.size());
            
            for (Item item : items) {
                try {
                    List<ItemSubstance> itemSubstances = itemSubstanceRepository.findByItemId(item.getId());
                    log.info("Indexing item: {} with {} substances", item.getItemNm(), itemSubstances.size());
                    
                    ItemSearchDocument doc = ItemSearchDocument.from(item, itemSubstances);
                    searchRepository.save(doc);
                    
                    log.info("Successfully indexed item: {}", item.getItemNm());
                } catch (Exception e) {
                    log.error("Error indexing item {}: {}", item.getId(), e.getMessage());
                }
            }
            log.info("Completed full indexing process");
        } catch (Exception e) {
            log.error("Error during full indexing: ", e);
        }
    }

    // 기존 검색 메서드
    public List<ItemSearchDocument> searchItems(String keyword) {
        log.info("Search keyword: {}", keyword);
        if (StringUtils.hasText(keyword)) {
            try {
                log.info("Executing search query for keyword: {}", keyword);
                List<ItemSearchDocument> results = searchRepository.findByKeyword(keyword);
                log.info("Search query executed, results count: {}", results.size());
                return results;
            } catch (Exception e) {
                log.error("Error occurred during search: ", e);
                return Collections.emptyList();
            }
        }
        return Collections.emptyList();
    }
}