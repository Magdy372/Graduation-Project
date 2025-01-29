package com.grad.course_management_services.dao;


import com.grad.course_management_services.models.Chapter;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findByCourseId(Long courseId);
   
}

