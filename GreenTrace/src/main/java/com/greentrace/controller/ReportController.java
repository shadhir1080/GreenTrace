package com.greentrace.controller;

import com.greentrace.dto.ReportRequest;
import com.greentrace.dto.ReportResponse;
import com.greentrace.dto.StatusUpdateRequest;
import com.greentrace.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ReportResponse> generate(@Valid @RequestBody ReportRequest request) {
        ReportResponse response = reportService.generate(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ReportResponse>> getAll(
            @RequestParam(required = false) Long organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(reportService.getAll(organizationId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReportResponse> updateStatus(@PathVariable Long id,
                                                       @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(reportService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
