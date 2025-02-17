/*
package com.javalab.student.entity.shop;

import com.javalab.student.constant.OrderStatus;
import com.javalab.student.entity.BaseEntity;
import com.javalab.student.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

*/
/**
 * 주문 엔티티
 *//*

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order_old extends BaseEntity {
    // 주문 엔티티의 기본키 id
    @Id
    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 자동 생성방식을 데이터베이스에 위임 Auto Increment
    private Long id;

    // 주문 엔티티와 회원 엔티티의 다대일 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 외래키 지정, member_id 컬럼이 외래키로 나에 설정된다.
    private Member member;

    // 주문 엔티티의 주문일
    private LocalDateTime orderDate;    // 주문일

    // 주문 엔티티의 주문상태
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;   // 주문상태

    */
/*
     * @OneToMany: 일대다 관계 설정
     * mappedBy: 연관관계의 주인을 설정, 연관관계의 주인이 자신이 아니라 OrderItem 엔티티의 order 필드임을 명시
     * JPA는 이 필드가 단순히 읽기 전용임을 알고, 외래 키 관리에 사용하지 않습니다.
     * CascadeType.ALL : Order 엔티티를 저장하거나 삭제할 때, 연관된 OrderItem 엔티티도 함께 저장하거나 삭제
     * orphanRemoval = true : Order 엔티티와 연관된 OrderItem 엔티티가 더 이상 참조되지 않으면 삭제
     *//*

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY,
                cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    //private LocalDateTime regTime;      // 등록일
    //private LocalDateTime updateTime;   // 수정일

    // 주문 엔티티에 주문상품을 추가하는 메서드
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);   // 양방향 연관관계 설정, OrderItem 엔티티의 order 필드에 자신(주문)을 설정
    }

    */
/**
     * 주문 엔티티 생성 메서드
     * - 장바구니에서 여러개의 상품을 주문할 때 사용
     * @param member
     * @param orderItemList
     * @return
     *//*

    public static Order_old createOrder(Member member, List<OrderItem> orderItemList) {
        // 1. 주문 엔티티 생성
        Order_old order = new Order_old();
        // 2. 주문 엔티티의 회원 필드에 회원 엔티티 설정
        order.setMember(member);
        // 3. 주문 엔티티의 주문상품 필드에 주문상품 리스트 설정
        for(OrderItem orderItem : orderItemList) {
            order.addOrderItem(orderItem);
        }
        // 4. 주문 엔티티의 주문상태 필드에 주문상태 설정
        order.setOrderStatus(OrderStatus.ORDER);
        // 5. 주문 엔티티의 주문일 필드에 현재 시간 설정
        order.setOrderDate(LocalDateTime.now());
        // 6. 주문 엔티티 반환
        return order;
    }

    // 총 주문 가격을 계산하는 메서드
    public int getTotalPrice() {
        int totalPrice = 0;
        for(OrderItem orderItem : orderItems){
            totalPrice += orderItem.getTotalPrice(); // 상품 가격 * 주문 수량
        }
        return totalPrice;
    }

    */
/**
     * 주문 취소
     * 주문 취소 시, 주문 상태를 취소로 변경하고, 주문 상품 리스트의 상품 수량을 순회 하면서 취소 처리
     *//*

    public void cancelOrder() {
        this.orderStatus = OrderStatus.CANCEL;
        for (OrderItem orderItem : orderItems) {
            orderItem.cancel();
        }
    }
}
*/
