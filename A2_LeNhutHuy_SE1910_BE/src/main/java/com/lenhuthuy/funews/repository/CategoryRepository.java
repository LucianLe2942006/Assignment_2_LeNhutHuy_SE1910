package com.lenhuthuy.funews.repository;

import com.lenhuthuy.funews.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {

    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);
}
