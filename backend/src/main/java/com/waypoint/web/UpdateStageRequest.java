package com.waypoint.web;

import com.waypoint.model.Stage;
import jakarta.validation.constraints.NotNull;

public record UpdateStageRequest(@NotNull Stage stage) {
}
