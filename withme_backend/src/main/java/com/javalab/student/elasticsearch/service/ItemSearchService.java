package com.javalab.student.elasticsearch.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;
import com.javalab.student.elasticsearch.repository.ItemSearchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemSearchService {

    private final ItemSearchRepository searchRepository;

    public List<ItemSearchDocument> searchItems(String keyword) {
    log.info("Search keyword: {}", keyword);
    if (StringUtils.hasText(keyword)) {
        try {
            // 전체 데이터 로깅 - Iterable을 List로 변환
            List<ItemSearchDocument> allDocs = StreamSupport.stream(
                searchRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
            
            log.info("Total documents in index: {}", allDocs.size());
            for (ItemSearchDocument doc : allDocs) {
                log.info("Document - ItemNm: {}, Substances: {}", 
                    doc.getItemNm(), 
                    doc.getSubstanceNames());
            }

            // 검색 실행
            List<ItemSearchDocument> results = searchRepository.findByItemNmOrItemDetailOrSubstanceNamesContaining(keyword);
            log.info("Search results count: {}", results.size());
            
            return results;
        } catch (Exception e) {
            log.error("Error occurred during search: ", e);
            return Collections.emptyList();
        }
    }
    return Collections.emptyList();
}
}
