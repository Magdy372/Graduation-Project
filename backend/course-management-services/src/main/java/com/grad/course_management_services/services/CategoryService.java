package com.grad.course_management_services.services;

import com.grad.course_management_services.models.Category;
import com.grad.course_management_services.dao.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Create or update a category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Delete a category
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
