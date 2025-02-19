package com.javalab.student.config;

import com.javalab.student.config.jwt.RefreshTokenCheckFilter;
import com.javalab.student.config.jwt.TokenAuthenticationFilter;
import com.javalab.student.config.jwt.TokenProvider;
import com.javalab.student.security.CustomUserDetailsService;
import com.javalab.student.security.handler.CustomAuthenticationEntryPoint;
import com.javalab.student.security.handler.CustomAuthenticationSuccessHandler;
import com.javalab.student.security.handler.CustomLogoutSuccessHandler;
import com.javalab.student.security.oauth.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 파일
 * - 인증, 권한 설정
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService; // 사용자 정보를 가져오는 역할
    private final CustomOAuth2UserService customOAuth2UserService;  // 소셜 로그인
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler; // 로그인 성공 핸들러
    private final TokenAuthenticationFilter tokenAuthenticationFilter; // 토큰을 검증하고 인증 객체를 SecurityContext에 저장하는 역할
    private final TokenProvider tokenProvider;  // 토큰 생성 및 검증
    private final RefreshTokenCheckFilter refreshTokenCheckFilter; // 추가된 필터
    private final CustomLogoutSuccessHandler customLogoutSuccessHandler; // 로그아웃 성공 핸들러

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.formLogin(form -> form
                .loginPage("/api/auth/login")
                .loginProcessingUrl("/api/auth/login")
                .successHandler(customAuthenticationSuccessHandler)
                .failureHandler((request, response, exception) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"login failure!\"}");
                })
                .permitAll()
        );

        http.logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler(customLogoutSuccessHandler)
                .permitAll()
        );

        http.authorizeHttpRequests(request -> request
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/topic/**").permitAll()

                // 문진 관련 API
                .requestMatchers("/api/questionnaires/free").permitAll()
                .requestMatchers("/api/questionnaires/{questionnaireId}").permitAll()
                .requestMatchers("/api/questionnaires/user/{userId}").permitAll()

                // 유료 문진 관련 API (ROLE_VIP만 접근 가능)
                .requestMatchers("/api/survey-topics/paid/**").hasRole("VIP")
                .requestMatchers("/api/user-selected-topics/**").hasRole("VIP")

                // 인증 및 회원 관련 API
                .requestMatchers("/", "/api/auth/login", "/api/auth/logout", "/api/members/register", "/api/members/checkEmail").permitAll()
                .requestMatchers("/api/auth/userInfo").permitAll()
                .requestMatchers("/api/members/**").hasAnyRole("USER", "ADMIN", "VIP", "DOCTOR")

                // 관리자 관련 API
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // 학생 관련 API
                .requestMatchers(HttpMethod.GET, "/api/students/**").permitAll()
                .requestMatchers("/api/students/**").hasRole("ADMIN")

                // 의사 관련 API
                .requestMatchers("/api/doctors/**").permitAll()

                // 메시지 및 커뮤니티 관련 API
                .requestMatchers("/api/messages/**").hasAnyRole("USER", "ADMIN", "VIP", "DOCTOR")
                .requestMatchers("/api/questions/**").hasAnyRole("USER", "VIP")
                .requestMatchers("/api/chat/**").hasAnyRole("USER", "ADMIN")

                // 정적 리소스 허용
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers(
                        "/images/**",
                        "/static-images/**",
                        "/css/**",
                        "/img/**",
                        "/favicon.ico",
                        "/error",
                        "/**/*.css",
                        "/**/*.js",
                        "/**/*.png",
                        "/**/*.jpg",
                        "/**/*.jpeg",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.html",
                        "/ping.js"
                ).permitAll()

                .anyRequest().authenticated()
        );

        http.addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(refreshTokenCheckFilter, TokenAuthenticationFilter.class);

        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
        );

        http.csrf(csrf -> csrf.disable());
        http.cors(Customizer.withDefaults());

        http.oauth2Login(oauth2 -> oauth2
                .loginPage("/members/login")
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
        );

        return http.build();
    }

    /**
     * AuthenticationManager 빈 등록
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}