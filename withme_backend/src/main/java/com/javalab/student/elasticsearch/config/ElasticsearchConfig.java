package com.javalab.student.elasticsearch.config;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.data.elasticsearch.core.document.Document;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import jakarta.annotation.PostConstruct;

import com.javalab.student.elasticsearch.document.ItemSearchDocument;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.javalab.student.elasticsearch.repository")
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    @Autowired
    private ApplicationContext applicationContext;

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
            .connectedTo("localhost:9200")
            .withConnectTimeout(Duration.ofSeconds(5))
            .withSocketTimeout(Duration.ofSeconds(30))
            .build();
    }

    @PostConstruct
public void createIndex() {
    try {
        ElasticsearchOperations operations = applicationContext.getBean(ElasticsearchOperations.class);
        IndexOperations indexOps = operations.indexOps(ItemSearchDocument.class);

        if (!indexOps.exists()) {
            // 설정
            Map<String, Object> settings = new HashMap<>();
            Map<String, Object> analysis = new HashMap<>();

            // Tokenizer 설정
            Map<String, Object> tokenizer = new HashMap<>();
            
            // nori 토크나이저
            Map<String, Object> noriTokenizer = new HashMap<>();
            noriTokenizer.put("type", "nori_tokenizer");
            noriTokenizer.put("decompound_mode", "mixed");
            
            // edge ngram 토크나이저
            Map<String, Object> edgeNGramTokenizer = new HashMap<>();
            edgeNGramTokenizer.put("type", "edge_ngram");
            edgeNGramTokenizer.put("min_gram", 1);
            edgeNGramTokenizer.put("max_gram", 10);
            
            tokenizer.put("nori_tok", noriTokenizer);
            tokenizer.put("edge_ngram_tok", edgeNGramTokenizer);

            // Analyzer 설정
            Map<String, Object> analyzer = new HashMap<>();
            
            // nori 분석기
            Map<String, Object> noriAnalyzer = new HashMap<>();
            noriAnalyzer.put("type", "custom");
            noriAnalyzer.put("tokenizer", "nori_tok");
            noriAnalyzer.put("filter", Arrays.asList("lowercase"));
            
            // edge ngram 분석기
            Map<String, Object> edgeNGramAnalyzer = new HashMap<>();
            edgeNGramAnalyzer.put("type", "custom");
            edgeNGramAnalyzer.put("tokenizer", "edge_ngram_tok");
            edgeNGramAnalyzer.put("filter", Arrays.asList("lowercase"));

            analyzer.put("nori_analyzer", noriAnalyzer);
            analyzer.put("edge_ngram_analyzer", edgeNGramAnalyzer);

            analysis.put("tokenizer", tokenizer);
            analysis.put("analyzer", analyzer);
            settings.put("analysis", analysis);

            // 인덱스 생성
            indexOps.create(settings);

            // 매핑 설정
            Document mapping = Document.create();
            Map<String, Object> properties = new HashMap<>();

            properties.put("itemNm", createMultiFieldMapping());
            properties.put("itemDetail", createMultiFieldMapping());
            properties.put("substanceNames", createMultiFieldMapping());
            properties.put("itemId", Map.of("type", "long"));
            properties.put("price", Map.of("type", "long"));
            properties.put("itemSellStatus", Map.of("type", "keyword"));
            properties.put("substanceIds", Map.of("type", "long"));

            mapping.put("properties", properties);
            indexOps.putMapping(mapping);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}

private Map<String, Object> createMultiFieldMapping() {
    Map<String, Object> field = new HashMap<>();
    field.put("type", "text");
    field.put("analyzer", "nori_analyzer");

    Map<String, Object> fields = new HashMap<>();
    
    // ngram 필드 추가
    Map<String, Object> ngram = new HashMap<>();
    ngram.put("type", "text");
    ngram.put("analyzer", "edge_ngram_analyzer");
    fields.put("ngram", ngram);
    
    field.put("fields", fields);
    return field;
}
}
