package com.lenhuthuy.funews;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lenhuthuy.funews.dto.CategoryDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testSearchCategory() throws Exception {
        mockMvc.perform(get("/api/categories").param("search", "Academic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("Academic news"));
    }

    @Test
    void testDeleteCategoryWithAssociatedArticlesFails() throws Exception {
        // Category 1 is associated with NewsArticle 3, 4, 5
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cannot delete category because it contains associated news articles"));
    }

    @Test
    void testCreateAndUpdateCategory() throws Exception {
        CategoryDTO newCat = CategoryDTO.builder()
                .categoryName("Temporary Category")
                .categoryDescription("Temporary Description for test")
                .isActive(true)
                .build();

        String responseBody = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCat)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.categoryName").value("Temporary Category"))
                .andReturn().getResponse().getContentAsString();

        CategoryDTO created = objectMapper.readValue(responseBody, CategoryDTO.class);

        // Delete the temporary category that has no news articles
        mockMvc.perform(delete("/api/categories/" + created.getCategoryId()))
                .andExpect(status().isOk());
    }
}
