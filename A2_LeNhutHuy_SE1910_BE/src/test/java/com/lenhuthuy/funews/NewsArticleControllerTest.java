package com.lenhuthuy.funews;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lenhuthuy.funews.dto.NewsArticleDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class NewsArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetPublicNews() throws Exception {
        mockMvc.perform(get("/api/news/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].newsStatus").value(true));
    }

    @Test
    void testGetStaffHistory() throws Exception {
        // Staff 1 (Emma William) has articles 1 and 2
        mockMvc.perform(get("/api/news/my-history").param("staffId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].createdById").value(1));
    }

    @Test
    void testGetAllTags() throws Exception {
        mockMvc.perform(get("/api/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].tagName").exists());
    }

    @Test
    void testCreateUpdateDeleteArticleWithTags() throws Exception {
        NewsArticleDTO dto = NewsArticleDTO.builder()
                .newsArticleId("TEST_NEWS_01")
                .newsTitle("Test Article Title")
                .headline("Test Article Headline")
                .newsContent("This is content of test article.")
                .newsSource("Test Source")
                .categoryId((short) 1)
                .createdById((short) 1)
                .newsStatus(true)
                .tagIds(List.of(1, 2))
                .build();

        mockMvc.perform(post("/api/news")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.newsArticleId").value("TEST_NEWS_01"))
                .andExpect(jsonPath("$.tags", hasSize(2)));

        // Update
        dto.setHeadline("Updated Headline");
        mockMvc.perform(put("/api/news/TEST_NEWS_01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.headline").value("Updated Headline"));

        // Delete
        mockMvc.perform(delete("/api/news/TEST_NEWS_01"))
                .andExpect(status().isOk());
    }
}
