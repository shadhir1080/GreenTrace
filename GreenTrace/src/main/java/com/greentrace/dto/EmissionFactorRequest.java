package com.greentrace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class EmissionFactorRequest {

    @NotBlank(message = "Activity type is required")
    private String activityType;

    private String description;

    @NotNull(message = "kgCo2PerUnit is required")
    @Positive(message = "kgCo2PerUnit must be positive")
    private Double kgCo2PerUnit;

    @NotBlank(message = "Unit is required")
    private String unit;

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getKgCo2PerUnit() { return kgCo2PerUnit; }
    public void setKgCo2PerUnit(Double kgCo2PerUnit) { this.kgCo2PerUnit = kgCo2PerUnit; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
