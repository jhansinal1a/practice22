package com.waypoint.web;

import jakarta.validation.constraints.NotBlank;

/** Human-readable call time as shown in the UI, e.g. "Jul 12, 2:00 PM". */
public record ScheduleCallRequest(@NotBlank String callTime) {
}
