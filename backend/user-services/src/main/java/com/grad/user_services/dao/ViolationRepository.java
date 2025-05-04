package com.grad.user_services.dao;


import com.grad.user_services.model.Violation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByUserIdAndCourseId(Long userId, Long courseId);
}

