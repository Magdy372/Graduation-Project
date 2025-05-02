package com.grad.course_management_services.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    private static final String Logo = "https://cabinet.gov.eg/Upload/News/Photo/62488/%D8%A7%D9%84%D8%B5%D8%AD%D8%A9.jpeg";

    public void sendCertificateEmail(String to, String userName, String courseName, 
                                   String certificateNumber, Double finalScore) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Prepare context
            Context context = new Context();
            context.setVariable("userName", userName);
            context.setVariable("courseName", courseName);
            context.setVariable("certificateNumber", certificateNumber);
            context.setVariable("finalScore", finalScore);
            context.setVariable("completionDate", java.time.LocalDate.now().toString());
            context.setVariable("logoUrl", Logo);

            // Process template
            String htmlContent = templateEngine.process("certificate-email", context);

            // Set email content
            helper.setTo(to);
            helper.setSubject("Course Completion Certificate - " + courseName);
            helper.setText(htmlContent, true);

            // Add PDF certificate
            ByteArrayOutputStream pdfOutputStream = pdfGeneratorService.generateCertificatePdf(
                userName, courseName, certificateNumber, finalScore
            );
            helper.addAttachment("Certificate.pdf", new ByteArrayResource(pdfOutputStream.toByteArray()));

            // Send email
            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send certificate email: " + e.getMessage(), e);
        }
    }

    public void sendEmailWithRetry(String to, String subject, String htmlContent, 
                                 int maxRetries) {
        int attempts = 0;
        while (attempts < maxRetries) {
            try {
                MimeMessage message = emailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                emailSender.send(message);
                return;
            } catch (Exception e) {
                attempts++;
                if (attempts == maxRetries) {
                    throw new RuntimeException("Failed to send email after " + maxRetries + " attempts", e);
                }
                try {
                    Thread.sleep(2000); // Wait 2 seconds before retrying
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Email sending interrupted", ie);
                }
            }
        }
    }

    public void sendSimpleEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
} 