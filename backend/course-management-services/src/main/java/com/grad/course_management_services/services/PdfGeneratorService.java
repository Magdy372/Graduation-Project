package com.grad.course_management_services.services;

import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.itextpdf.io.image.ImageDataFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGeneratorService {

    private static final Logger logger = LoggerFactory.getLogger(PdfGeneratorService.class);

    // Use a fallback image path in case the remote URL fails
    private static final String MOH_LOGO_URL = "https://cabinet.gov.eg/Upload/News/Photo/62488/%D8%A7%D9%84%D8%B5%D8%AD%D8%A9.jpeg";
    private static final Color PRIMARY_COLOR = new DeviceRgb(0, 102, 153); // Dark blue color

    public ByteArrayOutputStream generateCertificatePdf(String userName, String courseName,
                                                      String certificateNumber, Double finalScore) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            logger.info("Starting PDF certificate generation for user: {}", userName);

            // Create document in landscape format
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            PageSize pageSize = PageSize.A4.rotate(); // Landscape orientation
            pdf.setDefaultPageSize(pageSize);
            Document document = new Document(pdf);
            document.setMargins(20, 20, 20, 20);

            // Add decorative border safely
            try {
                drawDecorateBorder(pdf.getFirstPage(), PRIMARY_COLOR);
                logger.debug("Decorative border added successfully");
            } catch (Exception e) {
                logger.warn("Failed to draw border: {}", e.getMessage());
                // Continue without border if it fails
            }

            // Create main content table that spans the whole page
            Table mainTable = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();

            // Header section with logo - with error handling
            Table headerTable = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();

            // Left cell - MOH Logo (with error handling)
            Cell logoCell = new Cell();
            try {
                Image logo = createLogo();
                logo.setWidth(150); // Enlarge logo
                logoCell.add(logo);
                logger.debug("Logo added successfully");
            } catch (Exception e) {
                logger.warn("Failed to add logo: {}", e.getMessage());
                // Add a text placeholder if image fails
                logoCell.add(new Paragraph("Ministry of Health")
                        .setFontSize(16) // Enlarge placeholder font
                        .setBold());
            }
            logoCell.setBorder(Border.NO_BORDER);
            logoCell.setVerticalAlignment(VerticalAlignment.MIDDLE);
            headerTable.addCell(logoCell);

            // Right cell - Arabic Text
            Cell arabicCell = new Cell();
            Paragraph arabicText = new Paragraph("وزارة الصحة والسكان")
                    .setFontSize(24) // Enlarge Arabic text
                    .setBold()
                    .setTextAlignment(TextAlignment.RIGHT);
            arabicCell.add(arabicText);
            arabicCell.add(new Paragraph("جمهورية مصر العربية")
                    .setFontSize(18) // Enlarge second line
                    .setTextAlignment(TextAlignment.RIGHT));
            arabicCell.setBorder(Border.NO_BORDER);
            arabicCell.setVerticalAlignment(VerticalAlignment.MIDDLE);
            headerTable.addCell(arabicCell);

            // Add header table to main table
            Cell headerCell = new Cell();
            headerCell.add(headerTable);
            headerCell.setBorder(Border.NO_BORDER);
            headerCell.setPadding(10);
            mainTable.addCell(headerCell);

            // Title cell
            Cell titleCell = new Cell();
            titleCell.add(new Paragraph("Certificate of Completion")
                    .setFontSize(36) // Enlarge title
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(PRIMARY_COLOR));
            titleCell.setBorder(Border.NO_BORDER);
            titleCell.setPaddingTop(30); // Increase padding
            titleCell.setPaddingBottom(30); // Increase padding
            mainTable.addCell(titleCell);

            // Content cell
            Cell contentCell = new Cell();
            contentCell.add(new Paragraph("This is to certify that")
                    .setFontSize(18) // Enlarge introductory text
                    .setTextAlignment(TextAlignment.CENTER));

            // Name with color emphasis
            Paragraph nameParag = new Paragraph(userName)
                    .setFontSize(30) // Enlarge name
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(PRIMARY_COLOR);
            contentCell.add(nameParag);

            contentCell.add(new Paragraph("has successfully completed the course")
                    .setFontSize(18) // Enlarge completion text
                    .setTextAlignment(TextAlignment.CENTER));

            Paragraph courseNameParag = new Paragraph(courseName)
                    .setFontSize(26) // Enlarge course name
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(PRIMARY_COLOR);
            contentCell.add(courseNameParag);


            contentCell.setBorder(Border.NO_BORDER);
            contentCell.setPadding(20); // Increase padding
            mainTable.addCell(contentCell);

            // Create a table for date and signature
            Table footerTable = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();

            // Date cell
            Cell dateCell = new Cell();
            dateCell.add(new Paragraph("Issue Date:")
                    .setFontSize(14) // Enlarge label
                    .setBold());
            dateCell.add(new Paragraph(LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))) // Ensure full year
                    .setFontSize(14)); // Enlarge date
            dateCell.setBorder(Border.NO_BORDER);
            dateCell.setVerticalAlignment(VerticalAlignment.BOTTOM);
            footerTable.addCell(dateCell);

            // Signature cell
            Cell signatureCell = new Cell();
            Paragraph certificateNumberPara = new Paragraph("Certificate Number: " + certificateNumber)
                    .setFontSize(14) // Enlarge certificate number
                    .setTextAlignment(TextAlignment.RIGHT);
            Paragraph signatureTextPara = new Paragraph("Authorized Signature")
                    .setFontSize(14) // Enlarge signature text
                    .setPaddingTop(30)
                    .setTextAlignment(TextAlignment.RIGHT);

            // Add both paragraphs to the cell
            signatureCell.add(certificateNumberPara);
            signatureCell.add(signatureTextPara);

            signatureCell.setBorder(Border.NO_BORDER);
            signatureCell.setVerticalAlignment(VerticalAlignment.BOTTOM);
            footerTable.addCell(signatureCell);

            // Add footer table to main table
            Cell footerCell = new Cell();
            footerCell.add(footerTable);
            footerCell.setBorder(Border.NO_BORDER);
            footerCell.setPaddingTop(30); // Increase padding
            mainTable.addCell(footerCell);

            // Add the main table to the document
            document.add(mainTable);

            document.close();
            logger.info("PDF certificate generated successfully");

            return outputStream;
        } catch (Exception e) {
            logger.error("Failed to generate PDF certificate: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF certificate: " + e.getMessage(), e);
        }
    }

    /**
     * Creates logo image with error handling
     */
    private Image createLogo() {
        try {
            // Try to load from URL
            return new Image(ImageDataFactory.create(new URL(MOH_LOGO_URL)));
        } catch (IOException e) {
            logger.warn("Failed to load logo from URL: {}", e.getMessage());

            // Fallback to a create blank image
            byte[] blankImageBytes = new byte[0]; // Empty image data
            return new Image(ImageDataFactory.create(blankImageBytes));
        }
    }

    /**
     * Draws a decorative border around the page
     */
    private void drawDecorateBorder(com.itextpdf.kernel.pdf.PdfPage page, Color color) {
        Rectangle pageSize = page.getPageSize();
        PdfCanvas canvas = new PdfCanvas(page);

        // Outer border
        canvas.setStrokeColor(color);
        canvas.setLineWidth(2);
        canvas.rectangle(
                pageSize.getLeft() + 10,
                pageSize.getBottom() + 10,
                pageSize.getWidth() - 20,
                pageSize.getHeight() - 20);
        canvas.stroke();

        // Inner border
        canvas.setStrokeColor(color);
        canvas.setLineWidth(1);
        canvas.rectangle(
                pageSize.getLeft() + 20,
                pageSize.getBottom() + 20,
                pageSize.getWidth() - 40,
                pageSize.getHeight() - 40);
        canvas.stroke();
    }
}