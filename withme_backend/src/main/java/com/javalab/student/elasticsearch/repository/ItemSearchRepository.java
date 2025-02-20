package com.javalab.student.elasticsearch.repository;

import java.util.List;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;

@Repository
public interface ItemSearchRepository extends ElasticsearchRepository<ItemSearchDocument, String> {
    @Query("""
    {
      "bool": {
        "should": [
          {
            "bool": {
              "should": [
                {
                  "match_phrase_prefix": {
                    "itemNm": {
                      "query": "?0",
                      "analyzer": "nori_analyzer"
                    }
                  }
                },
                {
                  "match_phrase_prefix": {
                    "itemDetail": {
                      "query": "?0",
                      "analyzer": "nori_analyzer"
                    }
                  }
                }
              ]
            }
          },
          {
            "nested": {
              "path": "substanceNames",
              "query": {
                "match": {
                  "substanceNames": {
                    "query": "?0",
                    "analyzer": "nori_analyzer"
                  }
                }
              }
            }
          }
        ],
        "minimum_should_match": 1
      }
    }
    """)
    List<ItemSearchDocument> findByItemNmOrItemDetailOrSubstanceNamesContaining(String keyword);
}