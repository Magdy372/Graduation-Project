package com.grad.course_management_services.dao;



import com.grad.course_management_services.models.Video;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    List<Video> findByChapterId(Long chapterId);
    
}
