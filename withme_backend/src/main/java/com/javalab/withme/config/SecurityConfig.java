package com.javalab.withme.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.javalab.withme.config.jwt.RefreshTokenCheckFilter;
import com.javalab.withme.config.jwt.TokenAuthenticationFilter;
import com.javalab.withme.security.CustomUserDetailsService;
import com.javalab.withme.security.handler.CustomAuthenticationEntryPoint;
import com.javalab.withme.security.handler.CustomAuthenticationSuccessHandler;
import com.javalab.withme.security.handler.CustomLogoutSuccessHandler;
import com.javalab.withme.security.oauth.CustomOAuth2UserService;

/**
 * Spring Security 설정 파일
 * - 인증 및 권한 관리를 위한 설정 클래스
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService; // 사용자 정보를 로드하는 서비스
    private final CustomOAuth2UserService customOAuth2UserService;  // 소셜 로그인 사용자 정보 서비스
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler; // 로그인 성공 핸들러
    private final TokenAuthenticationFilter tokenAuthenticationFilter; // JWT 인증 필터
    private final RefreshTokenCheckFilter refreshTokenCheckFilter; // 리프레시 토큰 검증 필터
    private final CustomLogoutSuccessHandler customLogoutSuccessHandler; // 로그아웃 성공 핸들러

    /**
     * Spring Security 필터 체인을 설정하는 메서드
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 로그인 설정
        http.formLogin(form -> form
                .loginPage("/api/auth/login")   // 인증되지 않은 사용자가 접근 시 리다이렉트될 로그인 페이지 URL
                .loginProcessingUrl("/api/auth/login") // 로그인 요청 URL
                .usernameParameter("username") // 사용자 이름 파라미터 이름 설정
            .passwordParameter("password") // 비밀번호 파라미터 이름 설정
                .successHandler(customAuthenticationSuccessHandler) // 로그인 성공 시 동작할 핸들러
                .failureHandler((request, response, exception) -> { // 로그인 실패 시 처리 로직
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"로그인 실패!\"}");
                })
                .permitAll() // 모든 사용자가 접근 가능하도록 허용
        );

        // 로그아웃 설정
        http.logout(logout -> logout
                .logoutUrl("/api/auth/logout") // 로그아웃 요청 URL
                .logoutSuccessHandler(customLogoutSuccessHandler) // 로그아웃 성공 시 동작할 핸들러
                .permitAll() // 모든 사용자가 접근 가능하도록 허용
        );

        // 권한 및 접근 제어 설정
        http.authorizeHttpRequests(request -> request
                .requestMatchers(
                        "/", 
                        "/api/auth/**", 
                        "/favicon.ico", 
                        "/error", 
                        "/api/members/register", 
                        "/api/members/checkEmail"
                ).permitAll()  // 인증 없이 허용되는 엔드포인트 목록
                 // 공지사항 관련 엔드포인트
                 .requestMatchers(HttpMethod.GET, "/api/notices/**","/api/posts/**").permitAll() // GET 요청은 인증 없이 허용
                .requestMatchers("/admin/**").hasRole("ADMIN")  // ADMIN 역할만 접근 가능하도록 설정
                .requestMatchers("/api/members/**").hasAnyRole("USER", "ADMIN") // USER 또는 ADMIN 역할만 접근 가능하도록 설정
                .requestMatchers(
                        "/swagger-ui/**", 
                        "/v3/api-docs/**", 
                        "/swagger-ui.html"
                ).permitAll()  // Swagger UI 접근 허용 (API 문서화)
                .requestMatchers(
                        "/images/**",
                        "/static-images/**",
                        "/css/**",
                        "/img/**",
                        "/favicon.ico",
                        "/**/*.css",
                        "/**/*.js",
                        "/**/*.png",
                        "/**/*.jpg",
                        "/**/*.jpeg",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.html"
                ).permitAll()  // 정적 리소스에 대한 접근 허용 (CSS, JS, 이미지 등)
                .anyRequest().authenticated()  // 위에서 명시되지 않은 모든 요청은 인증 필요
        );

        // JWT 인증 필터 추가 (필터 체인 순서 정의)
        http.addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
        http.addFilterBefore(refreshTokenCheckFilter, TokenAuthenticationFilter.class); // 리프레시 토큰 검증 필터를 JWT 인증 필터 앞에 추가

        // 예외 처리 핸들러 설정 (인증 실패 시 처리)
        http.exceptionHandling(exception -> exception.authenticationEntryPoint(new CustomAuthenticationEntryPoint()));

        // CSRF 비활성화 및 CORS 활성화 (REST API를 위한 기본 설정)
        http.csrf(csrf -> csrf.disable());  // CSRF 비활성화 (REST API에서는 불필요)
        http.cors(Customizer.withDefaults());   // CORS 활성화 (기본 설정)

        // 소셜 로그인(OAuth2) 설정
        http.oauth2Login(oauth2 -> oauth2
                .loginPage("/members/login")  // 소셜 로그인 페이지 URL (React와 통합 시 필요 없음)
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService)) // 사용자 정보 서비스 연결 (CustomOAuth2UserService)
        );

        return http.build();
    }

    /**
     * AuthenticationManager 빈 등록 메서드 (사용자 인증 관리)
     * - AuthenticationManager는 사용자 인증을 처리하는 핵심 컴포넌트.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager(); // Spring Security에서 제공하는 기본 AuthenticationManager 반환
    }

    /**
     * PasswordEncoder 빈 등록 메서드 (비밀번호 암호화를 위한 BCrypt 사용)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCryptPasswordEncoder를 사용하여 비밀번호 암호화 처리
    }
}
