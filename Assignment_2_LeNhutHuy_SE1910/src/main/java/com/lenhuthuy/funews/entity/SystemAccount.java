/**
 * Student Name: Lê Nhựt Huy
 * Student ID  : CE200376
 */
package com.lenhuthuy.funews.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SystemAccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @Column(name = "AccountID")
    private Short accountId;

    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Column(name = "AccountEmail", length = 70)
    private String accountEmail;

    // 1: Admin, 2: Staff
    @Column(name = "AccountRole")
    private Integer accountRole;

    @Column(name = "AccountPassword", length = 70)
    private String accountPassword;
}
