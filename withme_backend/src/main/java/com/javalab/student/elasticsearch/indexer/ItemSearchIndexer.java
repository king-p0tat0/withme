package com.javalab.student.elasticsearch.indexer;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;
import com.javalab.student.elasticsearch.repository.ItemSearchRepository;
import com.javalab.student.entity.shop.Item;
import com.javalab.student.entity.shop.ItemSubstance;
import com.javalab.student.repository.shop.ItemRepository;
import com.javalab.student.repository.shop.ItemSubstanceRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 상품 검색을 위한 Elasticsearch 인덱스를 초기화하고 관리하는 서비스 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ItemSearchIndexer {

    private final ItemRepository itemRepository;
    private final ItemSubstanceRepository itemSubstanceRepository;
    private final ItemSearchRepository searchRepository;

    @PostConstruct
@Transactional(readOnly = true)
public void initializeIndex() {
    try {
        List<Item> items = itemRepository.findAll();
        log.info("총 상품 수: {}", items.size());

        List<ItemSearchDocument> searchDocuments = new ArrayList<>();

        for (Item item : items) {
            // 해당 상품의 모든 ItemSubstance 조회
            List<ItemSubstance> itemSubstances = itemSubstanceRepository.findByItem(item);
            
            System.out.println("상품명: " + item.getItemNm());
            System.out.println("해당 상품의 ItemSubstance 개수: " + itemSubstances.size());
            
            for (ItemSubstance substance : itemSubstances) {
                System.out.println("  성분 ID: " + substance.getSubstance().getSubstanceId());
                System.out.println("  성분명: " + substance.getSubstance().getName());
            }

            // 성분명 추출
            List<String> substanceNames = itemSubstances.stream()
                .map(is -> is.getSubstance().getName())
                .collect(Collectors.toList());

            ItemSearchDocument doc = new ItemSearchDocument();
            doc.setItemId(item.getId());
            doc.setItemNm(item.getItemNm());
            doc.setItemDetail(item.getItemDetail());
            doc.setPrice(item.getPrice());
            doc.setItemSellStatus(item.getItemSellStatus().name());
            
            // 성분명이 있는 경우에만 설정
            if (!substanceNames.isEmpty()) {
                doc.setSubstanceNames(substanceNames);
                System.out.println("상품명 " + item.getItemNm() + ": 성분 설정 - " + substanceNames);
            }

            searchDocuments.add(doc);
        }

        // 모든 문서 저장
        searchRepository.saveAll(searchDocuments);

        log.info("총 저장된 문서 수: {}", searchDocuments.size());
    } catch (Exception e) {
        log.error("Elasticsearch 인덱스 초기화 중 오류 발생", e);
        e.printStackTrace();
    }
}
}