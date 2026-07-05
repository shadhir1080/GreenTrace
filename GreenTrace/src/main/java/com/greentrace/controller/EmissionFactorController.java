package com.greentrace.controller;

import com.greentrace.dto.EmissionFactorRequest;
import com.greentrace.dto.EmissionFactorResponse;
import com.greentrace.service.EmissionFactorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emission-factors")
public class EmissionFactorController {

    private final EmissionFactorService emissionFactorService;

    public EmissionFactorController(EmissionFactorService emissionFactorService) {
        this.emissionFactorService = emissionFactorService;
    }

    @PostMapping
    public ResponseEntity<EmissionFactorResponse> create(@Valid @RequestBody EmissionFactorRequest request) {
        EmissionFactorResponse response = emissionFactorService.create(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<EmissionFactorResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(emissionFactorService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmissionFactorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(emissionFactorService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmissionFactorResponse> update(@PathVariable Long id,
                                                         @Valid @RequestBody EmissionFactorRequest request) {
        return ResponseEntity.ok(emissionFactorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        emissionFactorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
