package com.lenhuthuy.funews.service;

import com.lenhuthuy.funews.dto.NewsArticleDTO;
import com.lenhuthuy.funews.dto.TagDTO;
import com.lenhuthuy.funews.entity.Category;
import com.lenhuthuy.funews.entity.NewsArticle;
import com.lenhuthuy.funews.entity.SystemAccount;
import com.lenhuthuy.funews.entity.Tag;
import com.lenhuthuy.funews.exception.AppException;
import com.lenhuthuy.funews.repository.CategoryRepository;
import com.lenhuthuy.funews.repository.NewsArticleRepository;
import com.lenhuthuy.funews.repository.SystemAccountRepository;
import com.lenhuthuy.funews.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<NewsArticleDTO> getPublicNews() {
        // Khach vang lai chi xem tin tuc active (NewsStatus = true)
        return newsArticleRepository.findByNewsStatusTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NewsArticleDTO> getAllArticles(String search, Short categoryId, Boolean status) {
        List<NewsArticle> articles;
        if (search != null && !search.trim().isEmpty()) {
            articles = newsArticleRepository.searchByKeyword(search.trim());
        } else {
            articles = newsArticleRepository.findAll();
        }

        if (categoryId != null) {
            articles = articles.stream()
                    .filter(a -> a.getCategory() != null && categoryId.equals(a.getCategory().getCategoryId()))
                    .collect(Collectors.toList());
        }

        if (status != null) {
            articles = articles.stream()
                    .filter(a -> status.equals(a.getNewsStatus()))
                    .collect(Collectors.toList());
        }

        return articles.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NewsArticleDTO> getStaffHistory(Short staffId) {
        return newsArticleRepository.findByCreatedBy_AccountId(staffId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NewsArticleDTO getArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new AppException("Article not found with ID: " + id, HttpStatus.NOT_FOUND));
        return toDTO(article);
    }

    @Transactional
    public NewsArticleDTO createArticle(NewsArticleDTO dto, Short currentUserId) {
        String articleId = dto.getNewsArticleId();
        if (articleId == null || articleId.trim().isEmpty()) {
            articleId = String.valueOf(System.currentTimeMillis());
        }

        if (newsArticleRepository.existsById(articleId)) {
            throw new AppException("Article ID already exists: " + articleId, HttpStatus.BAD_REQUEST);
        }

        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new AppException("Category not found with ID: " + dto.getCategoryId(), HttpStatus.NOT_FOUND));
        }

        Short creatorId = currentUserId != null ? currentUserId : dto.getCreatedById();
        SystemAccount creator = null;
        if (creatorId != null) {
            creator = accountRepository.findById(creatorId).orElse(null);
        }

        Set<Tag> tags = new HashSet<>();
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            tags.addAll(tagRepository.findAllById(dto.getTagIds()));
        }

        NewsArticle article = NewsArticle.builder()
                .newsArticleId(articleId)
                .newsTitle(dto.getNewsTitle() != null ? dto.getNewsTitle().trim() : "")
                .headline(dto.getHeadline().trim())
                .createdDate(LocalDateTime.now())
                .newsContent(dto.getNewsContent())
                .newsSource(dto.getNewsSource())
                .category(category)
                .newsStatus(dto.getNewsStatus() != null ? dto.getNewsStatus() : true)
                .createdBy(creator)
                .updatedById(creatorId)
                .modifiedDate(LocalDateTime.now())
                .tags(tags)
                .build();

        NewsArticle saved = newsArticleRepository.save(article);
        return toDTO(saved);
    }

    @Transactional
    public NewsArticleDTO updateArticle(String id, NewsArticleDTO dto, Short currentUserId) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new AppException("Article not found with ID: " + id, HttpStatus.NOT_FOUND));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new AppException("Category not found with ID: " + dto.getCategoryId(), HttpStatus.NOT_FOUND));
            article.setCategory(category);
        }

        article.setNewsTitle(dto.getNewsTitle());
        article.setHeadline(dto.getHeadline());
        article.setNewsContent(dto.getNewsContent());
        article.setNewsSource(dto.getNewsSource());
        if (dto.getNewsStatus() != null) {
            article.setNewsStatus(dto.getNewsStatus());
        }

        if (dto.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(dto.getTagIds()));
            article.setTags(tags);
        }

        if (currentUserId != null) {
            article.setUpdatedById(currentUserId);
        }
        article.setModifiedDate(LocalDateTime.now());

        NewsArticle updated = newsArticleRepository.save(article);
        return toDTO(updated);
    }

    @Transactional
    public void deleteArticle(String id) {
        if (!newsArticleRepository.existsById(id)) {
            throw new AppException("Article not found with ID: " + id, HttpStatus.NOT_FOUND);
        }
        newsArticleRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(t -> TagDTO.builder()
                        .tagId(t.getTagId())
                        .tagName(t.getTagName())
                        .note(t.getNote())
                        .build())
                .collect(Collectors.toList());
    }

    private NewsArticleDTO toDTO(NewsArticle article) {
        List<TagDTO> tagDTOs = article.getTags().stream()
                .map(t -> TagDTO.builder()
                        .tagId(t.getTagId())
                        .tagName(t.getTagName())
                        .note(t.getNote())
                        .build())
                .collect(Collectors.toList());

        List<Integer> tagIds = article.getTags().stream()
                .map(Tag::getTagId)
                .collect(Collectors.toList());

        return NewsArticleDTO.builder()
                .newsArticleId(article.getNewsArticleId())
                .newsTitle(article.getNewsTitle())
                .headline(article.getHeadline())
                .createdDate(article.getCreatedDate())
                .newsContent(article.getNewsContent())
                .newsSource(article.getNewsSource())
                .categoryId(article.getCategory() != null ? article.getCategory().getCategoryId() : null)
                .categoryName(article.getCategory() != null ? article.getCategory().getCategoryName() : null)
                .newsStatus(article.getNewsStatus())
                .createdById(article.getCreatedBy() != null ? article.getCreatedBy().getAccountId() : null)
                .createdByName(article.getCreatedBy() != null ? article.getCreatedBy().getAccountName() : null)
                .updatedById(article.getUpdatedById())
                .modifiedDate(article.getModifiedDate())
                .tagIds(tagIds)
                .tags(tagDTOs)
                .build();
    }
}
