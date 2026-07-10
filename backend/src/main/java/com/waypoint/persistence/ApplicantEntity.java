package com.waypoint.persistence;

import com.waypoint.model.Applicant;
import com.waypoint.model.Review;
import com.waypoint.model.Stage;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "applicants")
public class ApplicantEntity {

    @Id
    private String id;

    private String name;

    private String posting;

    @Column(name = "applied_on")
    private String appliedOn;

    @Enumerated(EnumType.STRING)
    private Stage stage;

    @Column(name = "resume_file")
    private String resumeFile;

    @Column(name = "resume_score")
    private int resumeScore;

    @Column(name = "call_time")
    private String callTime;

    /** Preserves the mockup's display order across queries. */
    @Column(name = "seq")
    private int seq;

    @Embedded
    private ReviewEmbeddable review;

    protected ApplicantEntity() {
    }

    public ApplicantEntity(String id, String name, String posting, String appliedOn, Stage stage,
                           String resumeFile, int resumeScore, String callTime, int seq,
                           ReviewEmbeddable review) {
        this.id = id;
        this.name = name;
        this.posting = posting;
        this.appliedOn = appliedOn;
        this.stage = stage;
        this.resumeFile = resumeFile;
        this.resumeScore = resumeScore;
        this.callTime = callTime;
        this.seq = seq;
        this.review = review;
    }

    public Applicant toDto() {
        Review dto = review == null
                ? null
                : new Review(review.getRating(), review.getText(), review.getAuthor());
        return new Applicant(id, name, posting, appliedOn, stage, resumeFile, resumeScore, callTime, dto);
    }

    public String getId() {
        return id;
    }

    public String getPosting() {
        return posting;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }

    public void setCallTime(String callTime) {
        this.callTime = callTime;
    }
}
