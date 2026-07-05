package com.greentrace.service;

import com.greentrace.dto.OrganizationRequest;
import com.greentrace.dto.OrganizationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrganizationService {
    OrganizationResponse create(OrganizationRequest request);
    Page<OrganizationResponse> getAll(Pageable pageable);
    OrganizationResponse getById(Long id);
    OrganizationResponse update(Long id, OrganizationRequest request);
    void delete(Long id);
}
