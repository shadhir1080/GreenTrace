package com.greentrace.repository;

import com.greentrace.entity.FootprintReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FootprintReportRepository extends JpaRepository<FootprintReport, Long> {
    Page<FootprintReport> findByOrganizationId(Long organizationId, Pageable pageable);
}
