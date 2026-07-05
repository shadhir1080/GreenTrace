package com.greentrace.service;

import com.greentrace.dto.ReportRequest;
import com.greentrace.dto.ReportResponse;
import com.greentrace.dto.StatusUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {
    ReportResponse generate(ReportRequest request);
    Page<ReportResponse> getAll(Long organizationId, Pageable pageable);
    ReportResponse getById(Long id);
    ReportResponse updateStatus(Long id, StatusUpdateRequest request);
    void delete(Long id);
}
