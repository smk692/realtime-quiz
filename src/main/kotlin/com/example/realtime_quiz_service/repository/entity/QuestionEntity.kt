package com.example.realtime_quiz_service.repository.entity

import jakarta.persistence.*

@Entity
@Table(name = "questions")
data class QuestionEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, length = 1000)
    val content: String,

    @Column(nullable = false)
    val option1: String,

    @Column(nullable = false)
    val option2: String,

    @Column(nullable = false)
    val option3: String,

    @Column(nullable = false)
    val option4: String,

    @Column(nullable = false)
    val option5: String,

    @Column(nullable = false)
    val correctAnswer: Int
)