package com.grad.course_management_services.dao;


import com.grad.course_management_services.models.Category;
import com.grad.course_management_services.models.Course;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String categoryName);
   
}
