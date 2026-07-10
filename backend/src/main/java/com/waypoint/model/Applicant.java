package com.waypoint.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A candidate in the hiring pipeline. Field names and shape mirror the frontend's
 * {@code Applicant} interface. {@code callTime} and {@code review} are optional and are
 * omitted from JSON when null.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Applicant(
        String id,
        String name,
        String posting,
        String appliedOn,
        Stage stage,
        String resumeFile,
        int resumeScore,
        String callTime,
        Review review) {

    public Applicant withStage(Stage newStage) {
        return new Applicant(id, name, posting, appliedOn, newStage, resumeFile, resumeScore, callTime, review);
    }

    public Applicant withCall(String newCallTime, Stage newStage) {
        return new Applicant(id, name, posting, appliedOn, newStage, resumeFile, resumeScore, newCallTime, review);
    }
}
