package com.example.realtime_quiz_service.app.service.listener

import com.example.realtime_quiz_service.app.model.ChatMessage
import com.example.realtime_quiz_service.app.model.MessageType
import com.example.realtime_quiz_service.app.service.ChatMessageService
import org.springframework.context.event.EventListener
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import org.springframework.web.socket.messaging.SessionDisconnectEvent

@Component
class WebSocketEventListener(
    private val messagingTemplate: SimpMessagingTemplate,
    private val chatMessageService: ChatMessageService
) {
    @EventListener
    fun handleWebSocketDisconnectListener(event: SessionDisconnectEvent) {
        val headerAccessor = SimpMessageHeaderAccessor.wrap(event.message)
        val username = headerAccessor.sessionAttributes?.get("username") as String?

        if (username != null) {
            val chatMessage = ChatMessage(
                type = MessageType.LEAVE,
                sender = username,
                content = "$username 님이 퇴장하셨습니다."
            )

            // 채팅방에 퇴장 메시지 전송
            messagingTemplate.convertAndSend("/topic/public", chatMessage)

            // 퇴장 메시지를 데이터베이스에 저장
            chatMessageService.saveMessage(chatMessage)
        }
    }
}