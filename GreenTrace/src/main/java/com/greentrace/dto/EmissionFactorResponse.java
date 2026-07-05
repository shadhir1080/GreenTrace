package com.greentrace.dto;

import java.time.LocalDateTime;

public class EmissionFactorResponse {

    private Long id;
    private String activityType;
    private String description;
    private Double kgCo2PerUnit;
    private String unit;
    private LocalDateTime createdAt;

    public EmissionFactorResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getKgCo2PerUnit() { return kgCo2PerUnit; }
    public void setKgCo2PerUnit(Double kgCo2PerUnit) { this.kgCo2PerUnit = kgCo2PerUnit; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
