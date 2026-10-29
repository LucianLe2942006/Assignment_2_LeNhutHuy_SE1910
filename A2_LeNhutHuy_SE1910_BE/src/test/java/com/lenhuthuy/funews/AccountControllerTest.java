package com.lenhuthuy.funews;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lenhuthuy.funews.dto.AccountDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllAccounts() throws Exception {
        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testSearchAccount() throws Exception {
        mockMvc.perform(get("/api/accounts").param("search", "Steve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].accountName").value("Steve Paris"));
    }

    @Test
    void testDeleteAccountWithArticlesFails() throws Exception {
        // Account ID 1 (Emma William) created articles in seed data
        mockMvc.perform(delete("/api/accounts/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cannot delete account because it has created news articles"));
    }

    @Test
    void testCreateAndUpdateAccount() throws Exception {
        AccountDTO newAccount = AccountDTO.builder()
                .accountName("Temporary Tester")
                .accountEmail("temptester@funews.org")
                .accountRole(2)
                .accountPassword("Pass123")
                .build();

        String responseBody = mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newAccount)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accountName").value("Temporary Tester"))
                .andReturn().getResponse().getContentAsString();

        AccountDTO created = objectMapper.readValue(responseBody, AccountDTO.class);

        // Delete temporary account that has no news articles
        mockMvc.perform(delete("/api/accounts/" + created.getAccountId()))
                .andExpect(status().isOk());
    }
}
