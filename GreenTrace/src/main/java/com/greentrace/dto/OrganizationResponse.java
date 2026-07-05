package com.greentrace.dto;

import java.time.LocalDateTime;

public class OrganizationResponse {

    private Long id;
    private String name;
    private String industry;
    private String country;
    private LocalDateTime createdAt;

    public OrganizationResponse() {}

    public OrganizationResponse(Long id, String name, String industry, String country, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.country = country;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
