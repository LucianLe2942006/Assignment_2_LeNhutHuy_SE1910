package com.lenhuthuy.funews.service;

import com.lenhuthuy.funews.dto.LoginRequest;
import com.lenhuthuy.funews.dto.LoginResponse;
import com.lenhuthuy.funews.entity.SystemAccount;
import com.lenhuthuy.funews.exception.AppException;
import com.lenhuthuy.funews.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final SystemAccountRepository accountRepository;

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        String password = request.getPassword().trim();

        SystemAccount account = accountRepository.findByAccountEmail(email)
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!account.getAccountPassword().equals(password)) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        return LoginResponse.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .message("Login successfully")
                .build();
    }
}
