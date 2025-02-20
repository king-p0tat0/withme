package com.javalab.student.elasticsearch.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import com.javalab.student.entity.shop.Item;
import com.javalab.student.entity.shop.ItemSubstance;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Document(indexName = "search_index")
@Getter @Setter
public class ItemSearchDocument {

    @Id
    private String id;

    @Field(type = FieldType.Long)
    private Long itemId;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private String itemNm;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private String itemDetail;

    @Field(type = FieldType.Long)
    private Long price;

    @Field(type = FieldType.Keyword)
    private String itemSellStatus;

    @Field(type = FieldType.Long)
    private List<Long> substanceIds;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private List<String> substanceNames;

    // DB 엔티티로부터 문서를 생성하는 정적 팩토리 메서드
    public static ItemSearchDocument from(Item item, List<ItemSubstance> itemSubstances) {
        ItemSearchDocument doc = new ItemSearchDocument();
        doc.setItemId(item.getId());
        doc.setItemNm(item.getItemNm());
        doc.setItemDetail(item.getItemDetail());
        doc.setPrice(item.getPrice());
        doc.setItemSellStatus(item.getItemSellStatus().toString());
        
        if (itemSubstances != null && !itemSubstances.isEmpty()) {
            doc.setSubstanceIds(itemSubstances.stream()
                .map(is -> is.getSubstance().getSubstanceId())
                .collect(Collectors.toList()));
            doc.setSubstanceNames(itemSubstances.stream()
                .map(is -> is.getSubstance().getName())
                .collect(Collectors.toList()));
        }
        
        return doc;
    }
}