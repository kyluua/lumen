package com.lumen.core;

public record ValidationIssue(Severity severity, String code, String message, String action) {
    public static ValidationIssue error(String code, String message, String action) {
        return new ValidationIssue(Severity.ERROR, code, message, action);
    }

    public static ValidationIssue warning(String code, String message, String action) {
        return new ValidationIssue(Severity.WARNING, code, message, action);
    }

    public static ValidationIssue info(String code, String message) {
        return new ValidationIssue(Severity.INFO, code, message, "");
    }
}
