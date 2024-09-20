package com.example.realtime_quiz_service.repository

import com.example.realtime_quiz_service.repository.entity.QuestionEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionRepository : JpaRepository<QuestionEntity, Long>