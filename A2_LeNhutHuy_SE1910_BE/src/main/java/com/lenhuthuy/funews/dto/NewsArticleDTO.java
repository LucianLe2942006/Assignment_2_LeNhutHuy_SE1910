package com.lenhuthuy.funews.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleDTO {
    private String newsArticleId;

    @Size(max = 400, message = "Title must not exceed 400 characters")
    private String newsTitle;

    @NotBlank(message = "Headline is required")
    @Size(max = 150, message = "Headline must not exceed 150 characters")
    private String headline;

    private LocalDateTime createdDate;

    @Size(max = 4000, message = "Content must not exceed 4000 characters")
    private String newsContent;

    @Size(max = 400, message = "News source must not exceed 400 characters")
    private String newsSource;

    private Short categoryId;
    private String categoryName;

    private Boolean newsStatus;

    private Short createdById;
    private String createdByName;

    private Short updatedById;
    private LocalDateTime modifiedDate;

    private List<Integer> tagIds;
    private List<TagDTO> tags;
}
