package com.javalab.student.elasticsearch.config;

import java.time.Duration;
import java.util.HashMap;
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

import com.javalab.student.elasticsearch.document.ItemSearchDocument;

import jakarta.annotation.PostConstruct;

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
        
        if (indexOps.exists()) {
            indexOps.delete();
        }

        // settings
        Map<String, Object> settings = new HashMap<>();
        
        // analysis 설정
        Map<String, Object> analysis = new HashMap<>();
        
        // analyzer 설정
        Map<String, Object> analyzer = new HashMap<>();
        analyzer.put("type", "custom");
        analyzer.put("tokenizer", "standard");
        analyzer.put("filter", new String[]{"lowercase"});
        
        // analysis에 analyzer 추가
        analysis.put("analyzer", Map.of("custom_analyzer", analyzer));
        settings.put("analysis", analysis);
        
        // 인덱스 생성
        indexOps.create(settings);

        // 매핑 설정
        Document mapping = Document.create();
        Map<String, Object> properties = new HashMap<>();

        // 각 필드 매핑
        properties.put("itemNm", createTextFieldMapping());
        properties.put("itemDetail", createTextFieldMapping());
        properties.put("substanceNames", createTextFieldMapping());
        properties.put("itemId", createLongFieldMapping());
        properties.put("price", createLongFieldMapping());
        properties.put("itemSellStatus", createKeywordFieldMapping());
        properties.put("substanceIds", createLongFieldMapping());

        mapping.put("properties", properties);
        indexOps.putMapping(mapping);

    } catch (Exception e) {
        e.printStackTrace();
    }
}

private Map<String, Object> createTextFieldMapping() {
    Map<String, Object> field = new HashMap<>();
    field.put("type", "text");
    field.put("analyzer", "custom_analyzer");
    return field;
}

private Map<String, Object> createLongFieldMapping() {
    Map<String, Object> field = new HashMap<>();
    field.put("type", "long");
    return field;
}

private Map<String, Object> createKeywordFieldMapping() {
    Map<String, Object> field = new HashMap<>();
    field.put("type", "keyword");
    return field;
}
}