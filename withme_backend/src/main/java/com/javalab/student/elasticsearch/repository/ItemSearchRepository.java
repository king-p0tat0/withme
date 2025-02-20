package com.javalab.student.elasticsearch.repository;

import java.util.List;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.elasticsearch.annotations.Query;
import com.javalab.student.elasticsearch.document.ItemSearchDocument;

@Repository
public interface ItemSearchRepository extends ElasticsearchRepository<ItemSearchDocument, String> {
    @Query("{" +
           "  \"bool\": {" +
           "    \"should\": [" +
           "      {\"wildcard\": {\"itemNm\": \"*?0*\"}}," +
           "      {\"wildcard\": {\"itemDetail\": \"*?0*\"}}," +
           "      {\"wildcard\": {\"substanceNames\": \"*?0*\"}}," +
           "      {\"match_phrase\": {\"itemNm\": \"?0\"}}," +
           "      {\"match_phrase\": {\"itemDetail\": \"?0\"}}," +
           "      {\"match_phrase\": {\"substanceNames\": \"?0\"}}" +
           "    ]," +
           "    \"minimum_should_match\": 1" +
           "  }" +
           "}")
    List<ItemSearchDocument> findByKeyword(String keyword);
}