package com.greentrace.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReportResponse {

    private Long id;
    private Long organizationId;
    private String organizationName;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private Double totalEmissions;
    private LocalDateTime generatedAt;
    private String status;

    public ReportResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

    public Double getTotalEmissions() { return totalEmissions; }
    public void setTotalEmissions(Double totalEmissions) { this.totalEmissions = totalEmissions; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
