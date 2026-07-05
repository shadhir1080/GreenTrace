package com.greentrace.service.impl;

import com.greentrace.dto.AuthResponse;
import com.greentrace.dto.LoginRequest;
import com.greentrace.dto.RegisterRequest;
import com.greentrace.entity.Organization;
import com.greentrace.entity.SystemUser;
import com.greentrace.enums.UserRole;
import com.greentrace.exception.BusinessValidationException;
import com.greentrace.exception.ResourceNotFoundException;
import com.greentrace.repository.OrganizationRepository;
import com.greentrace.repository.SystemUserRepository;
import com.greentrace.security.CustomUserDetailsService;
import com.greentrace.security.JwtUtil;
import com.greentrace.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final SystemUserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthServiceImpl(SystemUserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager,
                           CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessValidationException("Email already registered: " + request.getEmail());
        }

        SystemUser user = new SystemUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                user.setRole(UserRole.valueOf(request.getRole()));
            } catch (IllegalArgumentException e) {
                throw new BusinessValidationException("Invalid role: " + request.getRole());
            }
        } else {
            user.setRole(UserRole.ROLE_ENVIRONMENTAL_AUDITOR);
        }

        if (request.getOrganizationId() != null) {
            Organization org = organizationRepository.findById(request.getOrganizationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + request.getOrganizationId()));
            user.setOrganization(org);
        }

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        Long orgId = user.getOrganization() != null ? user.getOrganization().getId() : null;
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name(), user.getId(), orgId);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            // If email is not registered yet, register it on the fly!
            if (!userRepository.existsByEmail(request.getEmail())) {
                RegisterRequest reg = new RegisterRequest();
                reg.setEmail(request.getEmail());
                reg.setPassword(request.getPassword());
                String namePrefix = request.getEmail().split("@")[0];
                reg.setName(namePrefix.substring(0, 1).toUpperCase() + namePrefix.substring(1));
                reg.setRole(UserRole.ROLE_ENVIRONMENTAL_AUDITOR.name());
                
                // Assign to the first organization automatically
                List<Organization> orgs = organizationRepository.findAll();
                if (!orgs.isEmpty()) {
                    reg.setOrganizationId(orgs.get(0).getId());
                }
                
                return register(reg);
            }
            throw e;
        }

        SystemUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        Long orgId = user.getOrganization() != null ? user.getOrganization().getId() : null;
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name(), user.getId(), orgId);
    }
}
