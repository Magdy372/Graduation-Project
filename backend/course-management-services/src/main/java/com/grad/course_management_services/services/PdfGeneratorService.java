package com.grad.course_management_services.services;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Image;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.HorizontalAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.time.LocalDate;

@Service
public class PdfGeneratorService {

    private static final String MOH_LOGO_URL = "https://cabinet.gov.eg/Upload/News/Photo/62488/%D8%A7%D9%84%D8%B5%D8%AD%D8%A9.jpeg";

    public ByteArrayOutputStream generateCertificatePdf(String userName, String courseName, 
                                                      String certificateNumber, Double finalScore) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Add logo
            Image logo = new Image(ImageDataFactory.create(new URL(MOH_LOGO_URL)));
            logo.setWidth(200);
            logo.setHorizontalAlignment(HorizontalAlignment.CENTER);
            document.add(logo);

            // Add certificate content
            document.add(new Paragraph("\n")); // Space after logo

            // Title
            Paragraph title = new Paragraph("Certificate of Completion")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // Subtitle
            document.add(new Paragraph("This is to certify that")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER));

            // User Name
            document.add(new Paragraph(userName)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));

            // Course completion text
            document.add(new Paragraph("has successfully completed the course")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER));

            // Course Name
            document.add(new Paragraph(courseName)
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));

            // Score
            document.add(new Paragraph("with a final score of " + finalScore + "%")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER));

            // Certificate details
            document.add(new Paragraph("\n")); // Space before details
            document.add(new Paragraph("Certificate Number: " + certificateNumber)
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("Issue Date: " + LocalDate.now().toString())
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER));

            // Arabic text
            document.add(new Paragraph("\n")); // Space before Arabic
            document.add(new Paragraph("وزارة الصحة والسكان")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER));

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF certificate", e);
        }

        return outputStream;
    }
} 