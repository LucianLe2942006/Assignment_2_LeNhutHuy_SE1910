package com.lenhuthuy.funews.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDTO {
    private Short accountId;

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name must not exceed 100 characters")
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 70, message = "Email must not exceed 70 characters")
    private String accountEmail;

    @NotNull(message = "Role is required")
    private Integer accountRole;

    @Size(max = 70, message = "Password must not exceed 70 characters")
    private String accountPassword;
}
