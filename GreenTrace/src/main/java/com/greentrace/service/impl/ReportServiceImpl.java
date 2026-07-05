package com.greentrace.service.impl;

import com.greentrace.dto.ReportRequest;
import com.greentrace.dto.ReportResponse;
import com.greentrace.dto.StatusUpdateRequest;
import com.greentrace.entity.FootprintReport;
import com.greentrace.entity.Organization;
import com.greentrace.enums.ReportStatus;
import com.greentrace.exception.BusinessValidationException;
import com.greentrace.exception.ResourceNotFoundException;
import com.greentrace.repository.CarbonActivityRepository;
import com.greentrace.repository.FootprintReportRepository;
import com.greentrace.repository.OrganizationRepository;
import com.greentrace.service.ReportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {

    private final FootprintReportRepository reportRepository;
    private final OrganizationRepository organizationRepository;
    private final CarbonActivityRepository activityRepository;

    public ReportServiceImpl(FootprintReportRepository reportRepository,
                              OrganizationRepository organizationRepository,
                              CarbonActivityRepository activityRepository) {
        this.reportRepository = reportRepository;
        this.organizationRepository = organizationRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public ReportResponse generate(ReportRequest request) {
        if (request.getPeriodEnd().isBefore(request.getPeriodStart())) {
            throw new BusinessValidationException("Period end date cannot be before period start date");
        }

        Organization org = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));

        Double totalEmissions = activityRepository.sumCalculatedCo2ByOrganizationAndDateRange(
                org.getId(),
                request.getPeriodStart(),
                request.getPeriodEnd()
        );

        FootprintReport report = new FootprintReport();
        report.setOrganization(org);
        report.setPeriodStart(request.getPeriodStart());
        report.setPeriodEnd(request.getPeriodEnd());
        report.setTotalEmissions(totalEmissions != null ? totalEmissions : 0.0);
        report.setStatus(ReportStatus.DRAFT);

        FootprintReport saved = reportRepository.save(report);
        return toResponse(saved);
    }

    @Override
    public Page<ReportResponse> getAll(Long organizationId, Pageable pageable) {
        if (organizationId != null) {
            return reportRepository.findByOrganizationId(organizationId, pageable).map(this::toResponse);
        }
        return reportRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public ReportResponse getById(Long id) {
        FootprintReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return toResponse(report);
    }

    @Override
    public ReportResponse updateStatus(Long id, StatusUpdateRequest request) {
        FootprintReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));

        try {
            report.setStatus(ReportStatus.valueOf(request.getStatus()));
        } catch (IllegalArgumentException e) {
            throw new BusinessValidationException("Invalid status: " + request.getStatus() + ". Use DRAFT or FINAL");
        }

        FootprintReport saved = reportRepository.save(report);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Report not found with id: " + id);
        }
        reportRepository.deleteById(id);
    }

    private ReportResponse toResponse(FootprintReport report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setPeriodStart(report.getPeriodStart());
        response.setPeriodEnd(report.getPeriodEnd());
        response.setTotalEmissions(report.getTotalEmissions());
        response.setGeneratedAt(report.getGeneratedAt());
        response.setStatus(report.getStatus().name());

        if (report.getOrganization() != null) {
            response.setOrganizationId(report.getOrganization().getId());
            response.setOrganizationName(report.getOrganization().getName());
        }

        return response;
    }
}
