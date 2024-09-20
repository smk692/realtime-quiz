package com.example.realtime_quiz_service.app.controller

import com.example.realtime_quiz_service.app.model.QuestionDto
import com.example.realtime_quiz_service.app.model.ScoresDto
import com.example.realtime_quiz_service.app.model.SubmitAnswersDto
import com.example.realtime_quiz_service.app.service.QuestionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
class QuestionController(
    private val questionService: QuestionService,
) {
    @GetMapping("/questions")
    fun getAllQuestions(): List<QuestionDto> = questionService.getAllQuestions()

    @GetMapping("/scoreboard")
    fun getScoreboard(): List<ScoresDto> = questionService.getRanks()

    @PostMapping("/questions/submit")
    fun submitAnswers(@RequestBody submitDto: SubmitAnswersDto): ResponseEntity<Map<Int, Boolean>> =
        ResponseEntity.ok(questionService.submitAnswers(submitDto))
}