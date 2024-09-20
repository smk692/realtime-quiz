package com.example.realtime_quiz_service.repository

import com.example.realtime_quiz_service.repository.entity.ChatMessageEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface ChatMessageRepository : JpaRepository<ChatMessageEntity, Long> {
    fun findAllByTimestampBetween(start: LocalDateTime, end: LocalDateTime): List<ChatMessageEntity>
}