package com.javalab.student.repository.shop;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.javalab.student.entity.shop.Item;
import com.javalab.student.entity.shop.ItemSubstance;

public interface ItemSubstanceRepository extends JpaRepository<ItemSubstance, Long> {

    /**
     * 주어진 상품(Item)에 연결된 ItemSubstance 목록을 조회합니다.
     * @param item 조회할 Item 객체
     * @return 해당 Item에 연결된 ItemSubstance 목록
     */
    List<ItemSubstance> findByItem(Item item);

    /**
     * 주어진 상품 ID(itemId)에 연결된 ItemSubstance 목록을 조회합니다.
     * @param itemId 조회할 Item ID
     * @return 해당 Item ID에 연결된 ItemSubstance 목록
     */
    List<ItemSubstance> findByItemId(Long itemId);

    /**
     * 주어진 상품 ID(itemId)에 연결된 ItemSubstance를 삭제합니다.
     * @param itemId 삭제할 ItemSubstance의 Item ID
     */
    @Modifying // 데이터 변경이 일어나는 쿼리(@DELETE, @UPDATE)에 사용
    @Query("DELETE FROM ItemSubstance is WHERE is.item.id = :itemId")
    void deleteByItemId(@Param("itemId") Long itemId);

    /**
     * 주어진 상품 ID(itemId)에 연결된 Substance ID 목록을 조회합니다.
     * @param itemId 조회할 Item ID
     * @return 해당 Item ID에 연결된 Substance ID 목록
     */
    @Query("SELECT is.substance.substanceId FROM ItemSubstance is WHERE is.item.id = :itemId")
    List<Long> findSubstanceIdsByItemId(@Param("itemId") Long itemId);
}
