package com.greentrace.repository;

import com.greentrace.entity.CarbonActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CarbonActivityRepository extends JpaRepository<CarbonActivity, Long> {

    Page<CarbonActivity> findByOrganizationId(Long organizationId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(a.calculatedCo2), 0) FROM CarbonActivity a " +
           "WHERE a.organization.id = :orgId " +
           "AND a.activityDate BETWEEN :startDate AND :endDate")
    Double sumCalculatedCo2ByOrganizationAndDateRange(
            @Param("orgId") Long orgId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
