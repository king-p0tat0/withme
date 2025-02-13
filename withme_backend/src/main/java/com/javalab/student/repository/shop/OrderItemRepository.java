package com.javalab.student.repository.shop;

import com.javalab.student.entity.shop.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * OrderItem 엔티티에 대한 CRUD를 담당하는 Repository
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
