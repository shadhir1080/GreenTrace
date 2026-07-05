package com.greentrace.service;

import com.greentrace.dto.UserRequest;
import com.greentrace.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse create(UserRequest request);
    Page<UserResponse> getAll(Pageable pageable);
    UserResponse getById(Long id);
    UserResponse update(Long id, UserRequest request);
    void delete(Long id);
}
