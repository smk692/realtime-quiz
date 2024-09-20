package com.example.realtime_quiz_service.app.service

import com.example.realtime_quiz_service.app.model.ChatMessage
import com.example.realtime_quiz_service.repository.entity.ChatMessageEntity
import com.example.realtime_quiz_service.app.model.MessageType
import com.example.realtime_quiz_service.repository.ChatMessageRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.LocalTime


@Service
class ChatMessageService(
    private val chatMessageRepository: ChatMessageRepository
) {
    fun saveMessage(chatMessage: ChatMessage) {
        val messageEntity = ChatMessageEntity(
            sender = chatMessage.sender ?: "Anonymous",
            content = chatMessage.content ?: "",
            type = chatMessage.type
        )
        chatMessageRepository.save(messageEntity)
    }

    fun getTodayWordFrequencies(): Map<String, Int> {
        val startOfDay = LocalDateTime.now().with(LocalTime.MIN)
        val endOfDay = LocalDateTime.now().with(LocalTime.MAX)
        val messages = chatMessageRepository.findAllByTimestampBetween(startOfDay, endOfDay)

        val wordFrequencies = mutableMapOf<String, Int>()

        messages.filter { it.type == MessageType.CHAT }.forEach { message ->
            val words = message.content.split("\\s+".toRegex())
            words.forEach { word ->
                val cleanedWord = word.trim().uppercase().replace(Regex("[^\\p{L}\\p{Nd}]"), "")
                if (cleanedWord.isNotEmpty()) {
                    wordFrequencies[cleanedWord] = wordFrequencies.getOrDefault(cleanedWord, 0) + 1
                }
            }
        }
        return wordFrequencies
    }
}