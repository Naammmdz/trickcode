package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.Order;
import java.util.List;
import com.naammm.trickcode.domain.enumeration.OrderStatus;
import java.math.BigDecimal;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.domain.Specification;
import java.time.Instant;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Order entity.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    @EntityGraph(attributePaths = {"user", "course"})
    Page<Order> findAll(Specification<Order> spec, Pageable pageable);

    Optional<Order> findOneByPaymentTxnRef(String paymentTxnRef);

    @Query("select jhiOrder from Order jhiOrder where jhiOrder.user.login = ?#{authentication.name}")
    List<Order> findByUserIsCurrentUser();

    @Query("select o from Order o left join fetch o.course where o.user.login = ?#{authentication.name} and o.status = 'COMPLETED' order by o.createdAt desc")
    List<Order> findByCurrentUserCompleted();

    default Optional<Order> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Order> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Order> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select jhiOrder from Order jhiOrder left join fetch jhiOrder.user left join fetch jhiOrder.course",
        countQuery = "select count(jhiOrder) from Order jhiOrder"
    )
    Page<Order> findAllWithToOneRelationships(Pageable pageable);

    @Query("select jhiOrder from Order jhiOrder left join fetch jhiOrder.user left join fetch jhiOrder.course")
    List<Order> findAllWithToOneRelationships();

    @Query("select jhiOrder from Order jhiOrder left join fetch jhiOrder.user left join fetch jhiOrder.course where jhiOrder.id =:id")
    Optional<Order> findOneWithToOneRelationships(@Param("id") Long id);

    List<Order> findAllByStatusAndCreatedAtGreaterThanEqual(OrderStatus status, Instant startDate);



    @Query("select sum(o.totalAmount) from Order o where o.status = :status")
    Optional<BigDecimal> sumTotalAmountByStatus(@Param("status") OrderStatus status);

    List<Order> findTop5ByOrderByIdDesc();

    @Query("select o from Order o left join fetch o.user left join fetch o.course where o.course.id in :courseIds and o.status = :status order by o.createdAt desc")
    List<Order> findByCourseIdInAndStatusOrderByCreatedAtDesc(@Param("courseIds") List<Long> courseIds, @Param("status") OrderStatus status);

    @Query("select coalesce(sum(o.totalAmount), 0) from Order o where o.course.id in :courseIds and o.status = :status")
    BigDecimal sumTotalAmountByCourseIdInAndStatus(@Param("courseIds") List<Long> courseIds, @Param("status") OrderStatus status);

    @Query("select o from Order o where o.course.id in :courseIds and o.status = :status and o.createdAt >= :startDate")
    List<Order> findByCourseIdInAndStatusAndCreatedAtGreaterThanEqual(@Param("courseIds") List<Long> courseIds, @Param("status") OrderStatus status, @Param("startDate") Instant startDate);
}
