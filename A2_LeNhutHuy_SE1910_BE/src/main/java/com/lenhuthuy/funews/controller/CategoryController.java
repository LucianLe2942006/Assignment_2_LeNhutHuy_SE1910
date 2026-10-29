package com.lenhuthuy.funews.controller;

import com.lenhuthuy.funews.dto.CategoryDTO;
import com.lenhuthuy.funews.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(categoryService.getAllCategories(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Short id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO dto) {
        CategoryDTO created = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Short id, @Valid @RequestBody CategoryDTO dto) {
        CategoryDTO updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Short id) {
        categoryService.deleteCategory(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Category deleted successfully");
        return ResponseEntity.ok(response);
    }
}
