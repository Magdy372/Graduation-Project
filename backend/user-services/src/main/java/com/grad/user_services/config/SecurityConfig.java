package com.grad.user_services.config;

import com.grad.user_services.services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;


@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CorsConfig corsConfig;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, 
                         CorsConfig corsConfig,
                         JwtAuthenticationFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.corsConfig = corsConfig;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // Define AuthenticationManager bean using AuthenticationConfiguration
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Configure CORS using your provided configuration
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            // Disable CSRF protection as it's typically unnecessary for stateless APIs
            .csrf(csrf -> csrf.disable())
            // Set session management to stateless (optional if you're not using sessions)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Permit all requests without any authentication
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            // Disable form login and HTTP Basic authentication
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());
    
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}