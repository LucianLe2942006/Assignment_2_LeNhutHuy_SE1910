package com.lenhuthuy.funews.controller;

import com.lenhuthuy.funews.dto.NewsArticleDTO;
import com.lenhuthuy.funews.dto.TagDTO;
import com.lenhuthuy.funews.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    // Public endpoint: xem tin tuc active khong can dang nhap
    @GetMapping("/news/public")
    public ResponseEntity<List<NewsArticleDTO>> getPublicNews() {
        return ResponseEntity.ok(newsArticleService.getPublicNews());
    }

    // Staff endpoint: quan ly danh sach tin tuc
    @GetMapping("/news")
    public ResponseEntity<List<NewsArticleDTO>> getAllArticles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Short categoryId,
            @RequestParam(required = false) Boolean status
    ) {
        return ResponseEntity.ok(newsArticleService.getAllArticles(search, categoryId, status));
    }

    // Staff endpoint: xem lich su bai viet do chinh minh tao
    @GetMapping("/news/my-history")
    public ResponseEntity<List<NewsArticleDTO>> getStaffHistory(@RequestParam Short staffId) {
        return ResponseEntity.ok(newsArticleService.getStaffHistory(staffId));
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<NewsArticleDTO> getArticleById(@PathVariable String id) {
        return ResponseEntity.ok(newsArticleService.getArticleById(id));
    }

    @PostMapping("/news")
    public ResponseEntity<NewsArticleDTO> createArticle(
            @Valid @RequestBody NewsArticleDTO dto,
            @RequestParam(required = false) Short staffId
    ) {
        NewsArticleDTO created = newsArticleService.createArticle(dto, staffId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/news/{id}")
    public ResponseEntity<NewsArticleDTO> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody NewsArticleDTO dto,
            @RequestParam(required = false) Short staffId
    ) {
        NewsArticleDTO updated = newsArticleService.updateArticle(id, dto, staffId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/news/{id}")
    public ResponseEntity<Map<String, String>> deleteArticle(@PathVariable String id) {
        newsArticleService.deleteArticle(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "News article deleted successfully");
        return ResponseEntity.ok(response);
    }

    // Lay danh sach tag de chon khi tao/sua tin
    @GetMapping("/tags")
    public ResponseEntity<List<TagDTO>> getAllTags() {
        return ResponseEntity.ok(newsArticleService.getAllTags());
    }
}
