package com.example.realtime_quiz_service.app.model

import com.example.realtime_quiz_service.repository.entity.QuestionEntity

data class QuestionDto(
    val id: Long,
    val content: String,
    val options: List<String>
    // 정답(correctAnswer)은 포함하지 않음
)

fun QuestionEntity.toDto(): QuestionDto {
    return QuestionDto(
        id = this.id,
        content = this.content,
        options = listOf(this.option1, this.option2, this.option3, this.option4, this.option5)
    )
}