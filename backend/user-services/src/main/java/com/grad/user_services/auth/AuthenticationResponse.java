package com.grad.user_services.auth;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

  private String message;
  private String accessToken;
  private String refreshToken;

  // Constructor to handle messages
  public AuthenticationResponse(String message) {
      this.message = message;
  }

  // Constructor to handle tokens
  public AuthenticationResponse(String accessToken, String refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
  }

  // Getters and Setters
  public String getMessage() {
      return message;
  }

  public void setMessage(String message) {
      this.message = message;
  }

  public String getAccessToken() {
      return accessToken;
  }

  public void setAccessToken(String accessToken) {
      this.accessToken = accessToken;
  }

  public String getRefreshToken() {
      return refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
      this.refreshToken = refreshToken;
  }
}

