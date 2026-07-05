package com.greentrace.service.impl;

import com.greentrace.dto.CarbonActivityRequest;
import com.greentrace.dto.CarbonActivityResponse;
import com.greentrace.entity.CarbonActivity;
import com.greentrace.entity.EmissionFactor;
import com.greentrace.entity.Organization;
import com.greentrace.entity.SystemUser;
import com.greentrace.exception.ResourceNotFoundException;
import com.greentrace.repository.CarbonActivityRepository;
import com.greentrace.repository.EmissionFactorRepository;
import com.greentrace.repository.OrganizationRepository;
import com.greentrace.repository.SystemUserRepository;
import com.greentrace.service.CarbonActivityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CarbonActivityServiceImpl implements CarbonActivityService {

    private final CarbonActivityRepository activityRepository;
    private final OrganizationRepository organizationRepository;
    private final EmissionFactorRepository emissionFactorRepository;
    private final SystemUserRepository userRepository;

    public CarbonActivityServiceImpl(CarbonActivityRepository activityRepository,
                                     OrganizationRepository organizationRepository,
                                     EmissionFactorRepository emissionFactorRepository,
                                     SystemUserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.organizationRepository = organizationRepository;
        this.emissionFactorRepository = emissionFactorRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CarbonActivityResponse create(CarbonActivityRequest request) {
        Organization org = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));

        EmissionFactor factor = emissionFactorRepository.findById(request.getEmissionFactorId())
                .orElseThrow(() -> new ResourceNotFoundException("Emission factor not found with id: " + request.getEmissionFactorId()));

        CarbonActivity activity = new CarbonActivity();
        activity.setOrganization(org);
        activity.setEmissionFactor(factor);
        activity.setQuantity(request.getQuantity());
        activity.setActivityDate(request.getActivityDate());
        activity.setNotes(request.getNotes());

        // calculatedCo2 is always computed server-side
        activity.setCalculatedCo2(request.getQuantity() * factor.getKgCo2PerUnit());

        if (request.getRecordedById() != null) {
            SystemUser recorder = userRepository.findById(request.getRecordedById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getRecordedById()));
            activity.setRecordedBy(recorder);
        }

        CarbonActivity saved = activityRepository.save(activity);
        return toResponse(saved);
    }

    @Override
    public Page<CarbonActivityResponse> getAll(Long organizationId, Pageable pageable) {
        if (organizationId != null) {
            return activityRepository.findByOrganizationId(organizationId, pageable).map(this::toResponse);
        }
        return activityRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public CarbonActivityResponse getById(Long id) {
        CarbonActivity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carbon activity not found with id: " + id));
        return toResponse(activity);
    }

    @Override
    public CarbonActivityResponse update(Long id, CarbonActivityRequest request) {
        CarbonActivity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carbon activity not found with id: " + id));

        Organization org = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));

        EmissionFactor factor = emissionFactorRepository.findById(request.getEmissionFactorId())
                .orElseThrow(() -> new ResourceNotFoundException("Emission factor not found with id: " + request.getEmissionFactorId()));

        activity.setOrganization(org);
        activity.setEmissionFactor(factor);
        activity.setQuantity(request.getQuantity());
        activity.setActivityDate(request.getActivityDate());
        activity.setNotes(request.getNotes());

        // Recalculate on update
        activity.setCalculatedCo2(request.getQuantity() * factor.getKgCo2PerUnit());

        if (request.getRecordedById() != null) {
            SystemUser recorder = userRepository.findById(request.getRecordedById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getRecordedById()));
            activity.setRecordedBy(recorder);
        }

        CarbonActivity saved = activityRepository.save(activity);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Carbon activity not found with id: " + id);
        }
        activityRepository.deleteById(id);
    }

    private CarbonActivityResponse toResponse(CarbonActivity activity) {
        CarbonActivityResponse response = new CarbonActivityResponse();
        response.setId(activity.getId());
        response.setQuantity(activity.getQuantity());
        response.setCalculatedCo2(activity.getCalculatedCo2());
        response.setActivityDate(activity.getActivityDate());
        response.setNotes(activity.getNotes());
        response.setCreatedAt(activity.getCreatedAt());

        if (activity.getOrganization() != null) {
            response.setOrganizationId(activity.getOrganization().getId());
            response.setOrganizationName(activity.getOrganization().getName());
        }

        if (activity.getEmissionFactor() != null) {
            response.setEmissionFactorId(activity.getEmissionFactor().getId());
            response.setActivityType(activity.getEmissionFactor().getActivityType());
            response.setUnit(activity.getEmissionFactor().getUnit());
        }

        if (activity.getRecordedBy() != null) {
            response.setRecordedById(activity.getRecordedBy().getId());
            response.setRecordedByName(activity.getRecordedBy().getName());
        }

        return response;
    }
}
