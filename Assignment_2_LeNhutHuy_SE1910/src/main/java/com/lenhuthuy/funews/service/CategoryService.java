/**
 * Student Name: Lê Nhựt Huy
 * Student ID  : CE200376
 */
package com.lenhuthuy.funews.service;

import com.lenhuthuy.funews.dto.CategoryDTO;
import com.lenhuthuy.funews.entity.Category;
import com.lenhuthuy.funews.exception.AppException;
import com.lenhuthuy.funews.repository.CategoryRepository;
import com.lenhuthuy.funews.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public List<CategoryDTO> getAllCategories(String search) {
        List<Category> list;
        if (search != null && !search.trim().isEmpty()) {
            list = categoryRepository.findByCategoryNameContainingIgnoreCase(search.trim());
        } else {
            list = categoryRepository.findAll();
        }
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException("Category not found with ID: " + id, HttpStatus.NOT_FOUND));
        return toDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = Category.builder()
                .categoryName(dto.getCategoryName().trim())
                .categoryDescription(dto.getCategoryDescription().trim())
                .parentCategoryId(dto.getParentCategoryId() != null ? dto.getParentCategoryId() : null)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Category saved = categoryRepository.save(category);
        return toDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Short id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException("Category not found with ID: " + id, HttpStatus.NOT_FOUND));

        category.setCategoryName(dto.getCategoryName().trim());
        category.setCategoryDescription(dto.getCategoryDescription().trim());
        category.setParentCategoryId(dto.getParentCategoryId());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : category.getIsActive());

        Category updated = categoryRepository.save(category);
        return toDTO(updated);
    }

    @Transactional
    public void deleteCategory(Short id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException("Category not found with ID: " + id, HttpStatus.NOT_FOUND);
        }

        // Khong duoc xoa category neu da co bai viet lien ket
        if (newsArticleRepository.existsByCategoryId(id)) {
            throw new AppException("Cannot delete category because it contains associated news articles", HttpStatus.BAD_REQUEST);
        }

        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .categoryDescription(category.getCategoryDescription())
                .parentCategoryId(category.getParentCategoryId())
                .isActive(category.getIsActive())
                .build();
    }
}
