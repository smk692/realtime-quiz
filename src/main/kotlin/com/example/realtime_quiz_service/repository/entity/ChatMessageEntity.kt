package com.example.realtime_quiz_service.repository.entity

import com.example.realtime_quiz_service.app.model.MessageType
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "chat_messages")
data class ChatMessageEntity (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val sender: String,

    @Column(length = 1000)
    val content: String,

    @Enumerated(EnumType.STRING)
    val type: MessageType,

    val timestamp: LocalDateTime = LocalDateTime.now()
)