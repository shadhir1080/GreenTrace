package com.greentrace.service;

import com.greentrace.dto.CarbonActivityRequest;
import com.greentrace.dto.CarbonActivityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CarbonActivityService {
    CarbonActivityResponse create(CarbonActivityRequest request);
    Page<CarbonActivityResponse> getAll(Long organizationId, Pageable pageable);
    CarbonActivityResponse getById(Long id);
    CarbonActivityResponse update(Long id, CarbonActivityRequest request);
    void delete(Long id);
}
