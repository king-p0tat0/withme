package com.javalab.student.elasticsearch.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import lombok.Getter;
import lombok.Setter;

@Document(indexName = "search_index")
@Setting(settingPath = "")
@Getter
@Setter
public class ItemSearchDocument {
    @Id
    private String id;

    @Field(type = FieldType.Long)
    private Long itemId;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private String itemNm;

    @Field(type = FieldType.Long)
    private Long price;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private String itemDetail;

    @Field(type = FieldType.Keyword)
    private String itemSellStatus;

    @Field(type = FieldType.Long)
    private List<Long> substanceIds;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private List<String> substanceNames;
}
