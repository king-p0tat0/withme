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
                .loginPage("/api/auth/login")   // 인증되지 않은 사용자가 보호된 리소스에 접근하면 /api/auth/login으로 리다이렉트됩니다.
                // Spring Security가 인증 처리할 URL(로그인 요청을 처리하는 URL)을 설정, 리액트에서 로그인을 요청할때 사용(/api/auth/login)
                .loginProcessingUrl("/api/auth/login")
                .successHandler(customAuthenticationSuccessHandler)
                .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"login failure!\"}");})
                .permitAll()
        );

        /*
            * [수정] 로그아웃 설정
            * logout() : 스프링의 기본 로그아웃 관련 설정
            * - /api/auth/logout 을 기본 로그아웃 요청을 처리하는 URL로 하겠다.
            *   즉 리액트에서 이 요청을 보내면 시큐리티의 기본 로그아웃 처리가 진행된다.
         */
        http.logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler(customLogoutSuccessHandler) // 커스텀 로그아웃 성공 핸들러 사용
                .permitAll()
        );

        /*
            * 정적 자원 및 URL에 대한 접근 제어 설정(인가) 로드맵
            * authorizeRequests() : 애플리케이션의 접근 제어(Authorization) 정책을 정의
            * requestMatchers() : 요청에 대한 보안 검사를 설정
            * permitAll() : 모든 사용자에게 접근을 허용
            * hasRole() : 특정 권한을 가진 사용자만 접근을 허용
            * anyRequest() : 모든 요청에 대해 접근을 허용
            * authenticated() : 인증된 사용자만 접근을 허용
            * favicon.ico : 파비콘 요청은 인증 없이 접근 가능, 이코드 누락시키면 계속 서버에 요청을 보내서 서버에 부하를 줄 수 있다.
         */
        http.authorizeHttpRequests(request -> request
                // ✅ WebSocket 관련 요청은 인증 검사 제외
                //    WebSocket 접속이 정상인지 체크하는 핸드쉐이크 요청인 /ws/info와 WebSocket 연결, /ws/**는 인증 없이 접근할 수 있도록 설정합니다.
                .requestMatchers("/ws/**").permitAll()  //
                .requestMatchers("/api/questionnaires/free").permitAll()
                .requestMatchers("/topic/**").permitAll()  // ✅ STOMP 메시지 브로커 경로 허용
                .requestMatchers("/", "/api/auth/login", "/api/auth/logout", "/api/members/register", "/api/members/checkEmail","/api/auth/login/kakao").permitAll() // 로그인 API 허용 [수정]
                .requestMatchers(HttpMethod.GET, "/api/notices/**","/api/posts/**","/api/comment/**","/api/posts/*/comments").permitAll() // GET 요청은 모든 사용자에게 허용
                //.requestMatchers("/api/posts/**", "/api/comments/**","/api/posts/*/comments/**").authenticated() //인증 필요
                .requestMatchers(HttpMethod.POST, "/api/posts", "/api/comments","/api/posts/*/comments").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/**", "/api/comments/**","/api/posts/*/comments/**").authenticated()
               .requestMatchers(HttpMethod.DELETE, "/api/posts/**", "/api/comments/**","/api/posts/*/comments/**").authenticated()
                // 공지사항 등록, 수정, 삭제는 ADMIN만 접근 가능
                .requestMatchers(HttpMethod.POST, "/api/notices/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/notices/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasRole("ADMIN")
                .requestMatchers("/api/students/**").hasRole("ADMIN")   // 학생 등록, 수정, 삭제는 ADMIN만 접근 가능
                .requestMatchers("/api/auth/userInfo").permitAll() // 사용자 정보 조회 API는 모든 사용자에게 허용
                .requestMatchers("/api/doctors/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/members/**").hasAnyRole("USER", "ADMIN","VIP") // 사용자 정보 수정 API는 USER, ADMIN만 접근 가능
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()  // 스웨거 Swagger UI는 인증을 거치지 않고 접근 가능
                .requestMatchers("/api/messages/**").hasAnyRole("USER", "ADMIN") // 사용자의 읽지 않은 메시지 개수 조회 API는 USER, ADMIN만 접근 가능
                .requestMatchers("/api/questions/**").hasAnyRole("USER","VIP")
                .requestMatchers("/api/chat/**").hasAnyRole("USER", "ADMIN") // 채팅방 생성, 채팅방 목록 조회 API는 USER, ADMIN만 접근 가능
                // 쇼핑몰
                .requestMatchers("/api/item/list", "/api/item/view/**").permitAll()
                .requestMatchers("/api/item/new", "/api/item/edit/**","/api/item/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/cart/**","/api/orders/**").hasAnyRole("ADMIN","USER","VIP","DOCTOR")


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
                ).permitAll() // 정적 리소스는 모두 허용
                .anyRequest().authenticated()
        );

        /*
        * 필터의 순서는 addFilterBefore 메서드를 사용하여 정의
        * RefreshTokenCheckFilter -> TokenAuthenticationFilter -> UsernamePasswordAuthenticationFilter 순서로 실행
        * UsernamePasswordAuthenticationFilter가 전체 필터 체인의 기준점
        * 콘솔 로그에서 Filter 로 검색하면 전체 필터와 순서가 출력됨.
        */
        /**
         * UsernamePasswordAuthenticationFilter 이전에 TokenAuthenticationFilter 추가
         * - 사용자의 인증이 일어나기 전에 토큰을 검증하고 인증 객체를 SecurityContext에 저장
         * - 그렇게 저장된 인증 객체는 컨트롤러에서 @AuthenticationPrincipal 어노테이션을 사용하여 사용할 수 있다.
         * [수정] UsernamePasswordAuthenticationFilter보다 앞에 있어야, 사용자가 제출한 인증 정보가 아닌 토큰을 통한 인증이 우선 처리됩니다.
         * 토큰 인증이 완료되지 않은 경우 폼 기반 인증을 수행하도록 체인에서 뒤쪽에 위치합니다.
         */
        http.addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        /**
         * RefreshTokenCheckFilter 추가, TokenAuthenticationFilter가 액세스 토큰의 유효성을 확인하기 전에
         * RefreshTokenCheckFilter가 리프레시 토큰의 유효성을 확인하고 액세스 토큰을 발급해야
         * 리프레시 토큰을 먼저 타면 혹시 액세스 토큰이 완료되어도 리프레시 토큰이 유효하다면 살릴 수가 있다.
         * 즉, TokenAuthenticationFilter보다 앞에 배치되어야, 토큰 갱신 작업이 먼저 이루어진 후 인증 검사가 실행됩니다.
         */
        http.addFilterBefore(refreshTokenCheckFilter, TokenAuthenticationFilter.class);


        /**
         * 인증 실패 시 처리할 핸들러를 설정
         * - 권한이 없는 페이지에 접근 시 처리할 핸들러를 설정
         * - 인증 실패 시 401 Unauthorized 에러를 반환
         */
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
        );

        // http.csrf(csrf -> csrf.disable()); // CSRF 보안 설정을 비활성화
        http.csrf(csrf -> csrf.disable());  // 프론트 엔드를 리액트로 할경우 CSRF 보안 설정을 비활성화
        http.cors(Customizer.withDefaults());   // 이 설정은 출처가 다른 도메인에서 요청을 허용하기 위한 설정, 스프링은 8080포트에서 실행되고 있고, 리액트는 3000포트에서 실행되고 있기 때문에 스프링은 3000 포트에서 오는 요청을 허용하지 않는다. 이를 해결하기 위해 CORS 설정을 추가한다.

        /*
         * 소셜 로그인 설정
         *  - oauth2Login() 메소드 : 소셜(OAuth2) 로그인을 활성화하는 설정의 시작점.
         *  - 이 메서드를 호출함으로써, 애플리케이션은 OAuth2 공급자(Google, Kakao 등)를
         *    통해 사용자 인증을 수행할 수 있게 된다.
         *  - loginPage() : 사용자가 인증되지 않은 상태에서 보호된 리소스에 접근시 여기로 리디렉트
         *    loginPage()를 설정하지 않으면 스프링 시큐리티는 기본 로그인 페이지(/login)를 사용.
         *  - userInfoEndpoint() : OAuth2 공급자로부터 사용자 정보를 가져오는 엔드포인트를 구성
         *  - userService() : 사용자 정보를 가져오는 서비스를 구현한 객체를 지정
         * - customOAuth2UserService : OAuth2 공급자로부터 사용자 정보를 가져오는 엔드포인트를 구성하는 실제 서비스 클래스
         */
        http.oauth2Login(oauth2 -> oauth2
                .loginPage("/api/auth/login/kakao")
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
        );

        // 지금까지 설정한 내용을 빌드하여 반환, 반환 객체는 SecurityFilterChain 객체
        return http.build();
    }

    /**
     * AuthenticationManager 빈 등록
     * - AuthenticationManagerBuilder를 사용하여 인증 객체를 생성하고 반환
     * - 이렇게 생성된 빈은 누구에 의해서 사용되는가? -> TokenAuthenticationFilter
     * - TokenAuthenticationFilter에서 인증 객체를 SecurityContext에 저장하기 위해 사용
     * @param http
     * @return
     * @throws Exception
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
     * - BCryptPasswordEncoder : BCrypt 해시 함수를 사용하여 비밀번호를 암호화
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}