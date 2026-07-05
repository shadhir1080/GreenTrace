package com.greentrace.service.impl;

import com.greentrace.dto.EmissionFactorRequest;
import com.greentrace.dto.EmissionFactorResponse;
import com.greentrace.entity.EmissionFactor;
import com.greentrace.exception.ResourceNotFoundException;
import com.greentrace.repository.EmissionFactorRepository;
import com.greentrace.service.EmissionFactorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EmissionFactorServiceImpl implements EmissionFactorService {

    private final EmissionFactorRepository emissionFactorRepository;

    public EmissionFactorServiceImpl(EmissionFactorRepository emissionFactorRepository) {
        this.emissionFactorRepository = emissionFactorRepository;
    }

    @Override
    public EmissionFactorResponse create(EmissionFactorRequest request) {
        EmissionFactor factor = new EmissionFactor();
        factor.setActivityType(request.getActivityType());
        factor.setDescription(request.getDescription());
        factor.setKgCo2PerUnit(request.getKgCo2PerUnit());
        factor.setUnit(request.getUnit());
        EmissionFactor saved = emissionFactorRepository.save(factor);
        return toResponse(saved);
    }

    @Override
    public Page<EmissionFactorResponse> getAll(Pageable pageable) {
        return emissionFactorRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public EmissionFactorResponse getById(Long id) {
        EmissionFactor factor = emissionFactorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emission factor not found with id: " + id));
        return toResponse(factor);
    }

    @Override
    public EmissionFactorResponse update(Long id, EmissionFactorRequest request) {
        EmissionFactor factor = emissionFactorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emission factor not found with id: " + id));
        factor.setActivityType(request.getActivityType());
        factor.setDescription(request.getDescription());
        factor.setKgCo2PerUnit(request.getKgCo2PerUnit());
        factor.setUnit(request.getUnit());
        EmissionFactor saved = emissionFactorRepository.save(factor);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!emissionFactorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Emission factor not found with id: " + id);
        }
        emissionFactorRepository.deleteById(id);
    }

    private EmissionFactorResponse toResponse(EmissionFactor factor) {
        EmissionFactorResponse response = new EmissionFactorResponse();
        response.setId(factor.getId());
        response.setActivityType(factor.getActivityType());
        response.setDescription(factor.getDescription());
        response.setKgCo2PerUnit(factor.getKgCo2PerUnit());
        response.setUnit(factor.getUnit());
        response.setCreatedAt(factor.getCreatedAt());
        return response;
    }
}
