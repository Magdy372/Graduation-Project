package com.grad.user_services.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grad.user_services.model.Feedback;


public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}