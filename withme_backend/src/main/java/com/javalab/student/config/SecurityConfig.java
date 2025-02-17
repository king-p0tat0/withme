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
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 파일
 * - 인증, 권한 설정
 * @Configuration :
 * - 이 클래스가 Spring의 설정 파일임을 명시, 여기에는 하나 이상의 @Bean이 있음.
 * - Spring 컨테이너가 이 클래스를 읽어들여 Bean으로 등록
 * @EnableWebSecurity :
 * - Spring Security 설정을 활성화하며 내부적으로 시큐리티 필터 체인을 생성,
 *   이를 통해서 애플리케이션이 요청을 처리할 때 필터 체인을 거쳐 (인증) 및 (인가)를 수행하게 된다.
 * - 시큐리티 필터 체인은 여러 개의 필터로 구성되면 디스패처 서블릿 앞에 위치하게 된다.
 * - CSRF, 세션 관리, 로그인, 로그아웃, 권한, XSS방지 등을 처리하는 기능들이 활성화 된다.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Log4j2
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final TokenAuthenticationFilter tokenAuthenticationFilter;
    private final TokenProvider tokenProvider;
    private final RefreshTokenCheckFilter refreshTokenCheckFilter;
    private final CustomLogoutSuccessHandler customLogoutSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 로그인 설정
        http.formLogin(form -> form
                .loginProcessingUrl("/api/auth/login")
                .successHandler(customAuthenticationSuccessHandler)
                .failureHandler((request, response, exception) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"로그인에 실패했습니다.\"}");
                })
                .permitAll()
        );

        // 로그아웃 설정
        http.logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler(customLogoutSuccessHandler)
                .permitAll()
        );

        // CORS 설정
        http.cors(Customizer.withDefaults());   // WebConfig의 CORS 설정을 사용

        // URL 접근 권한 설정
        http.authorizeHttpRequests(request -> request
        
                // WebSocket 설정
                .requestMatchers("/ws/**", "/topic/**").permitAll()
                
                // 인증 불필요 API
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/logout",
                    "/api/members/register",
                    "/api/members/checkEmail",
                    "/api/auth/login/kakao"
                ).permitAll()
                
                // GET 요청 허용
                .requestMatchers(HttpMethod.GET,
                        "/api/notices/**",
                        "/api/posts/**",
                        "/api/posts/*/comments",
                        "/api/comments/**",
                        "/api/members/{userId}/comments",
                        "/api/pets/user/{userId}",
                        "/api/posts/user/{userId}",
                        "/api/posts/comments/user/{userId}",
                        "/api/pets/image/**",
                        "/api/post/image/**",
                        "/api/item/list",
                        "/api/item/view/**"
                ).permitAll()

                // 반려동물 관련
                .requestMatchers(HttpMethod.POST, "/api/pets/register").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/pets/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/pets/**").authenticated()
                .requestMatchers("/api/pets/{petId}").authenticated()

                // 관리자 전용
                .requestMatchers(HttpMethod.POST, "/api/notices/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/notices/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasRole("ADMIN")
                .requestMatchers("/api/students/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/item/new", "/api/item/edit/**","/api/item/delete/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/posts/upload").permitAll()
                // 인증된 사용자 전용
                .requestMatchers(HttpMethod.POST, "/api/posts", "/api/posts/*/comments").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/**", "/api/posts/*/comments/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**", "/api/posts/*/comments/**").authenticated()

                // 특정 역할 사용자
                .requestMatchers("/api/members/**").hasAnyRole("USER", "ADMIN", "VIP")
                .requestMatchers("/api/messages/**", "/api/chat/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/cart/**","/api/orders/**").hasAnyRole("ADMIN","USER","VIP","DOCTOR")

                // API 문서 및 의사 관련
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/doctors/**").permitAll()
                .requestMatchers("/api/auth/userInfo").permitAll()

                // 정적 리소스
                .requestMatchers(
                        "/images/**",
                        "/image/**",
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
                
                // 그 외 요청
                .anyRequest().authenticated()
        );

        // 필터 설정
        http.addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(refreshTokenCheckFilter, TokenAuthenticationFilter.class);
        

        // 예외 처리
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
        );

        // CSRF 설정
        http.csrf(csrf -> csrf.disable());

        

        // OAuth2 로그인 설정
        http.oauth2Login(oauth2 -> oauth2
                .loginPage("/api/auth/login/kakao")
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
        );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}