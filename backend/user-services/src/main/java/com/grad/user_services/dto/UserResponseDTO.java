package com.grad.user_services.dto;

public class UserResponseDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String phonenumber;
    private String email;

    // Document Fields
    private String licenseFilePath;
    private String professionLicenseFilePath;
    private String syndicateCardFilePath;
    private String commercialRegisterFilePath;
    private String taxCardFilePath;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstname() { return firstname; }
    public void setFirstname(String firstname) { this.firstname = firstname; }

    public String getLastname() { return lastname; }
    public void setLastname(String lastname) { this.lastname = lastname; }

    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLicenseFilePath() { return licenseFilePath; }
    public void setLicenseFilePath(String licenseFilePath) { this.licenseFilePath = licenseFilePath; }

    public String getProfessionLicenseFilePath() { return professionLicenseFilePath; }
    public void setProfessionLicenseFilePath(String professionLicenseFilePath) { this.professionLicenseFilePath = professionLicenseFilePath; }

    public String getSyndicateCardFilePath() { return syndicateCardFilePath; }
    public void setSyndicateCardFilePath(String syndicateCardFilePath) { this.syndicateCardFilePath = syndicateCardFilePath; }

    public String getCommercialRegisterFilePath() { return commercialRegisterFilePath; }
    public void setCommercialRegisterFilePath(String commercialRegisterFilePath) { this.commercialRegisterFilePath = commercialRegisterFilePath; }

    public String getTaxCardFilePath() { return taxCardFilePath; }
    public void setTaxCardFilePath(String taxCardFilePath) { this.taxCardFilePath = taxCardFilePath; }
}
