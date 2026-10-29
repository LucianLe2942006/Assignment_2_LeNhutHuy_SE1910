package com.lenhuthuy.funews.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Short categoryId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String categoryName;

    @NotBlank(message = "Category description is required")
    @Size(max = 250, message = "Category description must not exceed 250 characters")
    private String categoryDescription;

    private Short parentCategoryId;
    private Boolean isActive;
}
