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
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

/**
 * Spring Security 설정 파일
 * - 인증, 권한 설정
 * @Configuration :
 * - 이 클래스가 Spring의 설정 파일임을 명시, 여기에는 하나 이상의 @Bean이 있음.
 * - Spring 컨테이너가 이 클래스를 읽어들여 Bean으로 등록
 * @EnableWebSecurity :
 * - Spring Security 설정을 활성화하며 내부적으로 시큐리티 필터 체인을 생성,
 *   이를 통해서 애플리케이션이 요청을 처리할 때 필터 체인을 거쳐 (인증) 및 (인가)를 수행하게 된다.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final TokenAuthenticationFilter tokenAuthenticationFilter;
    private final TokenProvider tokenProvider;
    private final RefreshTokenCheckFilter refreshTokenCheckFilter;
    private final CustomLogoutSuccessHandler customLogoutSuccessHandler;

    /**
     * SecurityFilterChain 설정
     * - CORS 설정 추가 (프론트엔드와의 연동을 위해)
     * - CSRF 보호 비활성화 (JWT 사용 시 필요 없음)
     * - JWT 기반 인증을 적용하기 위해 formLogin() 비활성화
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // CSRF 보호 비활성화 (JWT 사용 시 필요 없음)
                .csrf(csrf -> csrf.disable())

                // JWT 기반 인증 사용 (폼 로그인 비활성화)
                .formLogin().disable()

                // 요청 권한 설정
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/", "/api/auth/login", "/api/auth/logout", "/api/members/register", "/api/members/checkEmail").permitAll() // 로그인, 회원가입 관련 API 허용
                        .requestMatchers(HttpMethod.GET, "/api/students/**").permitAll() // 학생 정보 조회(GET) 요청 허용
                        .requestMatchers("/api/students/**").hasRole("ADMIN") // 학생 정보 수정, 삭제는 ADMIN만 가능
                        .requestMatchers("/api/auth/userInfo").authenticated() // 로그인한 사용자만 자신의 정보 조회 가능
                        .requestMatchers("/api/members/**").hasAnyRole("USER", "ADMIN") // USER, ADMIN만 접근 가능
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger API 문서 접근 허용
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )

                // 로그아웃 설정 (세션 삭제 및 쿠키 삭제 추가)
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout") // 로그아웃 요청 URL 지정
                        .logoutSuccessHandler(customLogoutSuccessHandler) // 커스텀 로그아웃 성공 핸들러 사용
                        .invalidateHttpSession(true) // 세션 무효화
                        .deleteCookies("JSESSIONID", "refreshToken") // 쿠키 삭제
                        .permitAll()
                );

        // 필터 순서 설정 없이 기본 순서대로 처리
        return http.build();
    }

    /**
     * AuthenticationManager 빈 등록
     * - AuthenticationConfiguration을 사용하여 인증 객체를 생성하고 반환
     * - 기존 HttpSecurity 방식 대신 AuthenticationConfiguration 사용 (Spring Security 5.7 이상에서 권장)
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder 빈 등록
     * - BCrypt 해시 함수를 사용하여 비밀번호를 암호화
     * - 10 라운드(기본값) 설정
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    /**
     * CORS 설정
     * - 허용할 Origin, 메서드, 헤더 설정
     * - `http://localhost:3001`에서의 요청을 허용
     * - 모든 HTTP 메서드(GET, POST, PUT, DELETE, OPTIONS)를 허용
     * - 모든 헤더를 허용하며, Credentials(쿠키 및 인증 정보)를 포함하도록 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3001")); // React 프론트엔드 도메인 허용
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드
        configuration.setAllowedHeaders(List.of("*")); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 쿠키 및 인증 정보 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
}

