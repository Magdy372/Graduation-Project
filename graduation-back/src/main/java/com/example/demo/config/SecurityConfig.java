package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF for simplicity (only for development)
            .authorizeHttpRequests()
            .requestMatchers("/api/**").permitAll() // Allow access to /api/** without authentication
            .anyRequest().authenticated() // Protect all other endpoints
            .and()
            .httpBasic(); // Enable basic authentication for protected endpoints

        return http.build();
    }
}
