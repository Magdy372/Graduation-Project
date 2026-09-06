# 🎓 Graduation Project

An **AI-powered E-Learning Platform** built using **Spring Boot Microservices**, React, and Python AI technologies.

## 🚀 Main Features

* User Registration & Login
* JWT Authentication & Authorization
* Course Management
* Chapters & Videos
* Quizzes & Exams
* AI Chatbot
* Course Recommendation System
* Medical Lecture Summarization
* Online Exam Proctoring
* Admin Dashboard
* MySQL Database

## 🏗️ Backend Architecture

The backend is built using **Spring Boot Microservices**.

Main technologies:

* **Spring Boot**
* **Microservices Architecture**
* **Spring Data JPA**
* **MySQL**
* **JWT Authentication**
* **Spring Security**
* **Eureka Server** – Service Discovery
* **API Gateway** – Single entry point for backend services
* **REST APIs**
* **Docker**

### Architecture

```text
                    ┌──────────────┐
                    │    React     │
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ API Gateway  │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │  User    │  │  Course  │  │  Quiz    │
       │ Service  │  │ Service  │  │ Service  │
       └────┬─────┘  └────┬─────┘  └────┬─────┘
            │             │             │
            └─────────────┼─────────────┘
                          ▼
                    ┌──────────────┐
                    │    Eureka    │
                    │    Server    │
                    └──────────────┘
```

## 🔐 Security

The application uses **JWT (JSON Web Token)** for authentication.

The authentication flow is:

```text
User
  ↓
Login
  ↓
Authentication Service
  ↓
JWT Token
  ↓
API Gateway
  ↓
Microservices
```

JWT is used to secure protected APIs and manage user authentication.

## 🤖 AI Modules

The project also contains several Python-based AI modules:

### AI Chatbot

Provides an intelligent chatbot for interacting with users.

### Recommendation System

Recommends courses based on user behavior and course information.

### Medical Summarization

Uses AI/NLP to generate summaries from medical lecture videos.

### Online Exam Proctoring

Uses computer vision for online exam monitoring, including face and object detection.

## 💻 Frontend

The frontend is developed using:

* React
* JavaScript
* HTML
* CSS

It communicates with the Spring Boot backend through REST APIs.

## 🗂️ Project Structure

```text
Graduation-Project/
│
├── backend/
│   └── Spring Boot Microservices
│
├── graduation-front/
│   └── React Frontend
│
├── Chatbot/
│   └── Python AI Chatbot
│
├── Recommendation/
│   └── Course Recommendation
│
├── Summarization/
│   └── Medical Lecture Summarization
│
├── Intelligent-Online-Exam-Proctoring-System-master/
│   └── Online Exam Proctoring
│
├── uploads/
│   └── Uploaded Files
│
└── db.sql
    └── Database Script
```

## 🛠️ Technologies

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Microservices
* JWT
* Eureka
* API Gateway
* REST API
* MySQL
* Docker

### Frontend

* React
* JavaScript
* HTML
* CSS

### AI

* Python
* Machine Learning
* NLP
* Computer Vision
* TensorFlow

## 🎯 Project Goal

The goal of this project is to build a modern **E-Learning Platform** that combines traditional online learning with **Microservices, AI, authentication, recommendation, summarization, and automated exam proctoring**.
