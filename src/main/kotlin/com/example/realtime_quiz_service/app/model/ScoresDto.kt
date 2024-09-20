package com.example.realtime_quiz_service.app.model

import java.time.LocalDateTime

data class ScoresDto(
    val userName: String,
    val score: Int,
    val timestamp: LocalDateTime,
)
