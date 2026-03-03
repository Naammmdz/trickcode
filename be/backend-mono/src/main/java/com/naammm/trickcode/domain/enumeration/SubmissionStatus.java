package com.naammm.trickcode.domain.enumeration;

/**
 * Status of a code submission.
 */
public enum SubmissionStatus {
    ACCEPTED,
    WRONG_ANSWER,
    COMPILE_ERROR,
    RUNTIME_ERROR,
    TIME_LIMIT_EXCEEDED,
    MEMORY_LIMIT_EXCEEDED,
    INTERNAL_ERROR,
}
