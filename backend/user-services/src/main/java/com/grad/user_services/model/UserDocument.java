package com.grad.user_services.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "user_documents")
public class UserDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "License file is required")
    @Column(name = "license_file")
    private String licenseFilePath;

    @NotBlank(message = "Profession license file is required")
    @Column(name = "profession_license_file")
    private String professionLicenseFilePath;

    @NotBlank(message = "Syndicate card file is required")
    @Column(name = "syndicate_card_file")
    private String syndicateCardFilePath;

    @NotBlank(message = "Commercial register file is required")
    @Column(name = "commercial_register_file")
    private String commercialRegisterFilePath;

    @NotBlank(message = "Tax card file is required")
    @Column(name = "tax_card_file")
    private String taxCardFilePath;

    @OneToOne(mappedBy = "userDocument", fetch = FetchType.LAZY)
    private User user;

    // Constructors
    public UserDocument() {}

    public UserDocument(String licenseFilePath, String professionLicenseFilePath, String syndicateCardFilePath, String commercialRegisterFilePath, String taxCardFilePath) {
        this.licenseFilePath = licenseFilePath;
        this.professionLicenseFilePath = professionLicenseFilePath;
        this.syndicateCardFilePath = syndicateCardFilePath;
        this.commercialRegisterFilePath = commercialRegisterFilePath;
        this.taxCardFilePath = taxCardFilePath;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicenseFilePath() {
        return licenseFilePath;
    }

    public void setLicenseFilePath(String licenseFilePath) {
        this.licenseFilePath = licenseFilePath;
    }

    public String getProfessionLicenseFilePath() {
        return professionLicenseFilePath;
    }

    public void setProfessionLicenseFilePath(String professionLicenseFilePath) {
        this.professionLicenseFilePath = professionLicenseFilePath;
    }

    public String getSyndicateCardFilePath() {
        return syndicateCardFilePath;
    }

    public void setSyndicateCardFilePath(String syndicateCardFilePath) {
        this.syndicateCardFilePath = syndicateCardFilePath;
    }

    public String getCommercialRegisterFilePath() {
        return commercialRegisterFilePath;
    }

    public void setCommercialRegisterFilePath(String commercialRegisterFilePath) {
        this.commercialRegisterFilePath = commercialRegisterFilePath;
    }

    public String getTaxCardFilePath() {
        return taxCardFilePath;
    }

    public void setTaxCardFilePath(String taxCardFilePath) {
        this.taxCardFilePath = taxCardFilePath;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // toString() method
    @Override
    public String toString() {
        return "UserDocument{" +
                "id=" + id +
                ", licenseFilePath='" + licenseFilePath + '\'' +
                ", professionLicenseFilePath='" + professionLicenseFilePath + '\'' +
                ", syndicateCardFilePath='" + syndicateCardFilePath + '\'' +
                ", commercialRegisterFilePath='" + commercialRegisterFilePath + '\'' +
                ", taxCardFilePath='" + taxCardFilePath + '\'' +
                '}';
    }
}