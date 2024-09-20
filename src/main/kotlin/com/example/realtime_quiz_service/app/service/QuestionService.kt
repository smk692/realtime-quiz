package com.example.realtime_quiz_service.app.service

import com.example.realtime_quiz_service.app.model.*
import com.example.realtime_quiz_service.repository.QuestionRepository
import com.example.realtime_quiz_service.repository.RankRepository
import com.example.realtime_quiz_service.repository.entity.QuestionEntity
import com.example.realtime_quiz_service.repository.entity.RankEntity
import org.springframework.data.domain.Sort
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class QuestionService(
    private val questionRepository: QuestionRepository,
    private val rankRepository: RankRepository,
    private val messagingTemplate: SimpMessagingTemplate,

) {
    fun getAllQuestions(): List<QuestionDto> {
        return questionRepository.findAll().map { it.toDto() }
    }

    fun getAllQuestionEntities(): List<QuestionEntity> {
        return questionRepository.findAll(Sort.by("id"))
    }

    fun getRanks(): List<ScoresDto> {
        return rankRepository.findAll(Sort.by(Sort.Order.desc("totalScore"), Sort.Order.asc("timestamp")))
            .map {
                ScoresDto(it.userName, it.totalScore, it.timestamp)
            }
    }

    @Transactional
    fun submitAnswers(submitDto: SubmitAnswersDto): Map<Int, Boolean> {
        val questions = getAllQuestionEntities()
        val userAnswers = submitDto.answers
        val userName = submitDto.userName

        require(userAnswers.size >= questions.size) { "Answer list size is less than questions list size." }

        val scoreMap = questions.indices.associateWith { index ->
            questions[index].correctAnswer == userAnswers[index]
        }

        val scoreSum = scoreMap.values.count { it }

        rankRepository.save(RankEntity(userName = userName, totalScore = scoreSum))

        val topUsers = rankRepository.findAll()
            .associate { it.userName to it.totalScore to it.timestamp}

        messagingTemplate.convertAndSend("/topic/scoreboard", topUsers)

        return scoreMap
    }
}