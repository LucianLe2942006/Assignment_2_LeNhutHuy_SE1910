package com.lenhuthuy.funews.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Short accountId;
    private String accountName;
    private String accountEmail;
    // 1: Admin, 2: Staff
    private Integer accountRole;
    private String message;
}
