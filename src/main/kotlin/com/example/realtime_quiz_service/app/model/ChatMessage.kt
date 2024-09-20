package com.example.realtime_quiz_service.app.model

data class ChatMessage(
    var type: MessageType,
    var content: String?,
    var sender: String?
)