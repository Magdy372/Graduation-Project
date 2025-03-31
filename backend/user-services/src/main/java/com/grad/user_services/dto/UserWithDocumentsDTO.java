package com.grad.user_services.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class UserWithDocumentsDTO {

    // User fields
    @NotBlank(message = "First name is required")
    @Size(max = 20, message = "First name must be less than 20 characters")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "First name must contain only letters")
    private String firstname;

    @NotBlank(message = "Last name is required")
    @Size(max = 20, message = "Last name must be less than 20 characters")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Last name must contain only letters")
    private String lastname;

    @NotBlank(message = "Phone number is required")
    //@Size(min = 11, max = 11, message = "Phone number must be exactly 11 characters")
    @Pattern(regexp = "^[0-9]{11}$", message = "Phone number must be exactly 11 digits")
    private String phonenumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Governorate is required")
    private String governorate;

    private boolean approved = false;

    // UserDocument fields (files)
    private MultipartFile licenseFile;
    private MultipartFile professionLicenseFile;
    private MultipartFile syndicateCardFile;
    private MultipartFile commercialRegisterFile;
    private MultipartFile taxCardFile;

    // Getters and Setters
    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGovernorate() {
        return governorate;
    }

    public void setGovernorate(String governorate) {
        this.governorate = governorate;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public MultipartFile getLicenseFile() {
        return licenseFile;
    }

    public void setLicenseFile(MultipartFile licenseFile) {
        this.licenseFile = licenseFile;
    }

    public MultipartFile getProfessionLicenseFile() {
        return professionLicenseFile;
    }

    public void setProfessionLicenseFile(MultipartFile professionLicenseFile) {
        this.professionLicenseFile = professionLicenseFile;
    }

    public MultipartFile getSyndicateCardFile() {
        return syndicateCardFile;
    }

    public void setSyndicateCardFile(MultipartFile syndicateCardFile) {
        this.syndicateCardFile = syndicateCardFile;
    }

    public MultipartFile getCommercialRegisterFile() {
        return commercialRegisterFile;
    }

    public void setCommercialRegisterFile(MultipartFile commercialRegisterFile) {
        this.commercialRegisterFile = commercialRegisterFile;
    }

    public MultipartFile getTaxCardFile() {
        return taxCardFile;
    }

    public void setTaxCardFile(MultipartFile taxCardFile) {
        this.taxCardFile = taxCardFile;
    }

}