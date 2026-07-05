package com.greentrace.service;

import com.greentrace.dto.AuthResponse;
import com.greentrace.dto.LoginRequest;
import com.greentrace.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
