package com.example.realtime_quiz_service.repository.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "rank")
data class RankEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "user_name", nullable = false)
    val userName: String,

    @Column(name= "total_score", nullable = false)
    val totalScore: Int,

    @Column(nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now()
)