package com.greentrace.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CarbonActivityResponse {

    private Long id;
    private Long organizationId;
    private String organizationName;
    private Long emissionFactorId;
    private String activityType;
    private Double quantity;
    private String unit;
    private Double calculatedCo2;
    private LocalDate activityDate;
    private String notes;
    private Long recordedById;
    private String recordedByName;
    private LocalDateTime createdAt;

    public CarbonActivityResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public Long getEmissionFactorId() { return emissionFactorId; }
    public void setEmissionFactorId(Long emissionFactorId) { this.emissionFactorId = emissionFactorId; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getCalculatedCo2() { return calculatedCo2; }
    public void setCalculatedCo2(Double calculatedCo2) { this.calculatedCo2 = calculatedCo2; }

    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getRecordedById() { return recordedById; }
    public void setRecordedById(Long recordedById) { this.recordedById = recordedById; }

    public String getRecordedByName() { return recordedByName; }
    public void setRecordedByName(String recordedByName) { this.recordedByName = recordedByName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
