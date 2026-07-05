package com.greentrace.service.impl;

import com.greentrace.dto.OrganizationRequest;
import com.greentrace.dto.OrganizationResponse;
import com.greentrace.entity.Organization;
import com.greentrace.exception.BusinessValidationException;
import com.greentrace.exception.ResourceNotFoundException;
import com.greentrace.repository.OrganizationRepository;
import com.greentrace.service.OrganizationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public OrganizationResponse create(OrganizationRequest request) {
        if (organizationRepository.existsByName(request.getName())) {
            throw new BusinessValidationException("Organization with name '" + request.getName() + "' already exists");
        }
        Organization org = new Organization();
        org.setName(request.getName());
        org.setIndustry(request.getIndustry());
        org.setCountry(request.getCountry());
        Organization saved = organizationRepository.save(org);
        return toResponse(saved);
    }

    @Override
    public Page<OrganizationResponse> getAll(Pageable pageable) {
        return organizationRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public OrganizationResponse getById(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + id));
        return toResponse(org);
    }

    @Override
    public OrganizationResponse update(Long id, OrganizationRequest request) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + id));
        org.setName(request.getName());
        org.setIndustry(request.getIndustry());
        org.setCountry(request.getCountry());
        Organization saved = organizationRepository.save(org);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!organizationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Organization not found with id: " + id);
        }
        organizationRepository.deleteById(id);
    }

    private OrganizationResponse toResponse(Organization org) {
        return new OrganizationResponse(
                org.getId(),
                org.getName(),
                org.getIndustry(),
                org.getCountry(),
                org.getCreatedAt()
        );
    }
}
