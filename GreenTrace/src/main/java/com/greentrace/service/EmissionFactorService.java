package com.greentrace.service;

import com.greentrace.dto.EmissionFactorRequest;
import com.greentrace.dto.EmissionFactorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmissionFactorService {
    EmissionFactorResponse create(EmissionFactorRequest request);
    Page<EmissionFactorResponse> getAll(Pageable pageable);
    EmissionFactorResponse getById(Long id);
    EmissionFactorResponse update(Long id, EmissionFactorRequest request);
    void delete(Long id);
}
