/**
 * Student Name: Lê Nhựt Huy
 * Student ID  : CE200376
 */
package com.lenhuthuy.funews.service;

import com.lenhuthuy.funews.dto.AccountDTO;
import com.lenhuthuy.funews.entity.SystemAccount;
import com.lenhuthuy.funews.exception.AppException;
import com.lenhuthuy.funews.repository.NewsArticleRepository;
import com.lenhuthuy.funews.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    public List<AccountDTO> getAllAccounts(String search) {
        List<SystemAccount> accounts;
        if (search != null && !search.trim().isEmpty()) {
            accounts = accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
                    search.trim(), search.trim()
            );
        } else {
            accounts = accountRepository.findAll();
        }
        return accounts.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AccountDTO getAccountById(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException("Account not found with ID: " + id, HttpStatus.NOT_FOUND));
        return toDTO(account);
    }

    @Transactional
    public AccountDTO createAccount(AccountDTO dto) {
        String email = dto.getAccountEmail().trim();
        if (accountRepository.existsByAccountEmail(email)) {
            throw new AppException("Email already exists: " + email, HttpStatus.BAD_REQUEST);
        }

        Short id = dto.getAccountId();
        if (id == null || id <= 0) {
            id = (short) (accountRepository.findMaxAccountId() + 1);
        }

        String password = dto.getAccountPassword();
        if (password == null || password.trim().isEmpty()) {
            password = "@1"; // default password
        }

        SystemAccount account = SystemAccount.builder()
                .accountId(id)
                .accountName(dto.getAccountName().trim())
                .accountEmail(email)
                .accountRole(dto.getAccountRole())
                .accountPassword(password.trim())
                .build();

        SystemAccount saved = accountRepository.save(account);
        return toDTO(saved);
    }

    @Transactional
    public AccountDTO updateAccount(Short id, AccountDTO dto) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new AppException("Account not found with ID: " + id, HttpStatus.NOT_FOUND));

        String newEmail = dto.getAccountEmail().trim();
        if (!account.getAccountEmail().equalsIgnoreCase(newEmail)) {
            if (accountRepository.existsByAccountEmail(newEmail)) {
                throw new AppException("Email already in use by another account: " + newEmail, HttpStatus.BAD_REQUEST);
            }
            account.setAccountEmail(newEmail);
        }

        account.setAccountName(dto.getAccountName().trim());
        if (dto.getAccountRole() != null) {
            account.setAccountRole(dto.getAccountRole());
        }
        if (dto.getAccountPassword() != null && !dto.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(dto.getAccountPassword().trim());
        }

        SystemAccount updated = accountRepository.save(account);
        return toDTO(updated);
    }

    @Transactional
    public void deleteAccount(Short id) {
        if (!accountRepository.existsById(id)) {
            throw new AppException("Account not found with ID: " + id, HttpStatus.NOT_FOUND);
        }

        // Khong duoc xoa tai khoan neu da tung tao bai viet
        if (newsArticleRepository.existsByCreatedById(id)) {
            throw new AppException("Cannot delete account because it has created news articles", HttpStatus.BAD_REQUEST);
        }

        accountRepository.deleteById(id);
    }

    private AccountDTO toDTO(SystemAccount account) {
        return AccountDTO.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .accountPassword(account.getAccountPassword())
                .build();
    }
}
