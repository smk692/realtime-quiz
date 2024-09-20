package com.example.realtime_quiz_service.app.controller

import com.example.realtime_quiz_service.app.model.ChatMessage
import com.example.realtime_quiz_service.app.model.WordFrequencyDto
import com.example.realtime_quiz_service.app.service.ChatMessageService
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller


@Controller
class ChatController(
    private val chatMessageService: ChatMessageService,
    private val messagingTemplate: SimpMessagingTemplate,
) {
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    fun sendMessage(@Payload chatMessage: ChatMessage): ChatMessage {
        // 메시지를 데이터베이스에 저장
        chatMessageService.saveMessage(chatMessage)

        // 단어 빈도수 업데이트
        val wordFrequencies = chatMessageService.getTodayWordFrequencies()

        // DTO 변환
        val frequencyDtos = wordFrequencies.map { WordFrequencyDto(it.key, it.value) }

        // 단어 빈도수 브로드캐스트
        messagingTemplate.convertAndSend("/topic/wordFrequencies", frequencyDtos)

        return chatMessage
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    fun addUser(
        @Payload chatMessage: ChatMessage,
        headerAccessor: SimpMessageHeaderAccessor
    ): ChatMessage {
        val username = chatMessage.sender ?: "Anonymous"
        headerAccessor.sessionAttributes?.put("username", username)
        chatMessage.content = "$username 님이 입장하셨습니다."
        chatMessageService.saveMessage(chatMessage)

        return chatMessage
    }
}