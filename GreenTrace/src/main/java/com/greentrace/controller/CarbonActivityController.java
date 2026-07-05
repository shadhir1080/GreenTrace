package com.greentrace.controller;

import com.greentrace.dto.CarbonActivityRequest;
import com.greentrace.dto.CarbonActivityResponse;
import com.greentrace.service.CarbonActivityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
public class CarbonActivityController {

    private final CarbonActivityService activityService;

    public CarbonActivityController(CarbonActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<CarbonActivityResponse> create(@Valid @RequestBody CarbonActivityRequest request) {
        CarbonActivityResponse response = activityService.create(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<CarbonActivityResponse>> getAll(
            @RequestParam(required = false) Long organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(activityService.getAll(organizationId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarbonActivityResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarbonActivityResponse> update(@PathVariable Long id,
                                                         @Valid @RequestBody CarbonActivityRequest request) {
        return ResponseEntity.ok(activityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
