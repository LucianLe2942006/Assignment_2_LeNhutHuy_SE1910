package com.lenhuthuy.funews.repository;

import com.lenhuthuy.funews.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    @Query("SELECT COUNT(n) > 0 FROM NewsArticle n WHERE n.category.categoryId = :categoryId")
    boolean existsByCategoryId(@Param("categoryId") Short categoryId);

    @Query("SELECT COUNT(n) > 0 FROM NewsArticle n WHERE n.createdBy.accountId = :accountId")
    boolean existsByCreatedById(@Param("accountId") Short accountId);

    List<NewsArticle> findByNewsStatusTrue();

    List<NewsArticle> findByCreatedBy_AccountId(Short accountId);

    @Query("SELECT n FROM NewsArticle n WHERE LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<NewsArticle> searchByKeyword(@Param("keyword") String keyword);
}
