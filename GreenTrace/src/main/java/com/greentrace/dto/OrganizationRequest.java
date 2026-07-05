package com.greentrace.dto;

import jakarta.validation.constraints.NotBlank;

public class OrganizationRequest {

    @NotBlank(message = "Organization name is required")
    private String name;

    private String industry;

    private String country;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}
