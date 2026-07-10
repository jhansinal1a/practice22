package com.waypoint.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Pipeline stage for an applicant. The JSON label (e.g. "Call scheduled") matches the
 * strings the frontend uses in {@code data.ts}, so the API and UI share one vocabulary.
 */
public enum Stage {
    APPLIED("Applied"),
    REVIEWED("Reviewed"),
    CALL_SCHEDULED("Call scheduled"),
    SELECTED("Selected");

    private final String label;

    Stage(String label) {
        this.label = label;
    }

    @JsonValue
    public String label() {
        return label;
    }

    @JsonCreator
    public static Stage fromLabel(String value) {
        for (Stage stage : values()) {
            if (stage.label.equalsIgnoreCase(value)) {
                return stage;
            }
        }
        throw new IllegalArgumentException("Unknown stage: " + value);
    }
}
