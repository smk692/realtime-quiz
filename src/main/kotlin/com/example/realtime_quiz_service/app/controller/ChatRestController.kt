package com.example.realtime_quiz_service.app.controller

import com.example.realtime_quiz_service.app.service.ChatMessageService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api")
class ChatRestController(
    private val chatMessageService: ChatMessageService
) {

    @GetMapping("/word-frequencies/today")
    fun getTodayWordFrequencies(): Map<String, Int> {
        return chatMessageService.getTodayWordFrequencies()
    }
}