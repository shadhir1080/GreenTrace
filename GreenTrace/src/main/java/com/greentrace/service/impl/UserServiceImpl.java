package com.greentrace.service.impl;

import com.greentrace.dto.UserRequest;
import com.greentrace.dto.UserResponse;
import com.greentrace.entity.Organization;
import com.greentrace.entity.SystemUser;
import com.greentrace.enums.UserRole;
import com.greentrace.exception.BusinessValidationException;
import com.greentrace.exception.ResourceNotFoundException;
import com.greentrace.repository.OrganizationRepository;
import com.greentrace.repository.SystemUserRepository;
import com.greentrace.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final SystemUserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(SystemUserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessValidationException("Email already in use: " + request.getEmail());
        }

        SystemUser user = new SystemUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            user.setRole(UserRole.valueOf(request.getRole()));
        } catch (IllegalArgumentException e) {
            throw new BusinessValidationException("Invalid role: " + request.getRole());
        }

        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));
            user.setOrganization(org);
        }

        SystemUser saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    public Page<UserResponse> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public UserResponse getById(Long id) {
        SystemUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    @Override
    public UserResponse update(Long id, UserRequest request) {
        SystemUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        try {
            user.setRole(UserRole.valueOf(request.getRole()));
        } catch (IllegalArgumentException e) {
            throw new BusinessValidationException("Invalid role: " + request.getRole());
        }

        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));
            user.setOrganization(org);
        } else {
            user.setOrganization(null);
        }

        SystemUser saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(SystemUser user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setCreatedAt(user.getCreatedAt());
        if (user.getOrganization() != null) {
            response.setOrganizationId(user.getOrganization().getId());
            response.setOrganizationName(user.getOrganization().getName());
        }
        return response;
    }
}
