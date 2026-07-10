package com.waypoint.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ReviewEmbeddable {

    @Column(name = "review_rating")
    private Integer rating;

    @Column(name = "review_text", columnDefinition = "text")
    private String text;

    @Column(name = "review_author")
    private String author;

    protected ReviewEmbeddable() {
    }

    public ReviewEmbeddable(Integer rating, String text, String author) {
        this.rating = rating;
        this.text = text;
        this.author = author;
    }

    public Integer getRating() {
        return rating;
    }

    public String getText() {
        return text;
    }

    public String getAuthor() {
        return author;
    }
}
