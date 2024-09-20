package com.example.realtime_quiz_service.app.model

data class SubmitAnswersDto(
    val userName: String,
    val answers: List<Int>
)