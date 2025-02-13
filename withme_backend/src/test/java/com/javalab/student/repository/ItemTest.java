package com.javalab.student.repository;

import com.javalab.student.constant.ItemSellStatus;
import com.javalab.student.entity.shop.Item;
import com.javalab.student.repository.shop.ItemRepository;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Log4j2
@Transactional
public class ItemTest {
    @Autowired
    ItemRepository itemRepository;  // 테스트할 ItemRepository 빈 주입

    // 아이템 한 개 저장 테스트
    @Test
    @DisplayName("상품 저장 테스트")
    //@Rollback(false)  // 롤백 방지
    public void saveItemTest(){
        // Given : 테스트용 Item 엔티티 생성
        Item item = Item.builder()
                .itemNm("테스트 상품 한개 저장")
                .price(10000)
                .stockNumber(50)
                .itemDetail("테스트 상품 상세 설명")
                .itemSellStatus(ItemSellStatus.SELL)
                //.regTime(LocalDateTime.now())
                .build();

        // When(작동) : 테스트 대상 메서드 호출
        // save() : Item 엔티티를 저장하는 메서드(영속 상태로 전환)
        Item savedItem = itemRepository.save(item);  // 저장된 Item 엔티티 반환

        // Then(검증) : 위에서 생성한 엔티티와 영속화된 엔티티를 비교해서 검증
        // import static org.assertj.core.api.Assertions.assertThat; 추가
        // 1차 검증, 저장된 Item 엔티티의 ID가 null이 아닌지 검증
        assertThat(savedItem.getId()).isNotNull();
        // 2. 검증, 저장된 Item 엔티티의 상품명과 테스트 Item 엔티티의 상품명이 같은지 검증
        assertThat(savedItem.getItemNm()).isEqualTo(item.getItemNm());
        // 저장된 값 확인
        log.info("savedItem: {}", savedItem);
    }
}
