package com.javalab.student.elasticsearch.indexer;

// import java.util.List;

// import org.springframework.stereotype.Component;

// import com.javalab.student.elasticsearch.entity.ItemSearchElasticsearch;
// import com.javalab.student.elasticsearch.entity.ItemSearchJpa;
// import com.javalab.student.elasticsearch.repository.ItemSearchElasticsearchRepository;
// import com.javalab.student.elasticsearch.repository.ItemSearchJpaRepository;

// import jakarta.annotation.PostConstruct;

// @Component
// public class ItemSearchIndexer {

//     private final ItemSearchJpaRepository jpaRepository;
//     private final ItemSearchElasticsearchRepository elasticsearchRepository;

//     public ItemSearchIndexer(ItemSearchJpaRepository jpaRepository,
//                              ItemSearchElasticsearchRepository elasticsearchRepository) {
//         this.jpaRepository = jpaRepository;
//         this.elasticsearchRepository = elasticsearchRepository;
//     }

//     @PostConstruct
//     public void indexItems() {
//         // JPA에서 모든 데이터를 가져옴
//         List<ItemSearchJpa> items = jpaRepository.findAll();

//         // Elasticsearch에 색인
//         List<ItemSearchElasticsearch> elasticItems = items.stream()
//                 .map(item -> {
//                     ItemSearchElasticsearch elasticItem = new ItemSearchElasticsearch();
//                     elasticItem.setId(item.getId().toString());
//                     elasticItem.setName(item.getName());
//                     elasticItem.setDescription(item.getDescription());
//                     return elasticItem;
//                 })
//                 .toList();

//         // Elasticsearch에 저장
//         elasticsearchRepository.saveAll(elasticItems);
//     }
// }
