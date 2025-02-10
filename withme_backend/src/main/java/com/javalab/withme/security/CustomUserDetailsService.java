package com.javalab.withme.security;

import com.javalab.withme.entity.Member;
import com.javalab.withme.repository.MemberRepository;
import com.javalab.withme.security.dto.MemberSecurityDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * 사용자 정보를 가져오는 역할
 * - UserDetailsService 인터페이스를 구현하여 사용자 정보를 가져오는 역할
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    /**
     * 사용자 정보를 가져오는 역할
     * - 여기서 반환된 객체는 인증이 완료되지 않았으며, 인증은 AuthenticationManager가 수행
     * - 반환된 UserDetails 객체는 SecurityContextHolder에 저장됨.
     *
     * @param username 사용자의 이메일 (Spring Security에서 username으로 사용)
     * @throws UsernameNotFoundException 사용자 정보가 없거나 유효하지 않을 경우 발생
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("CustomUserDetailsService - loadUserByUsername 호출. 전달된 username(이메일): {}", username);
    
        if (username == null || username.isEmpty()) {
            log.error("사용자 이름(이메일)이 비어 있습니다.");
            throw new UsernameNotFoundException("사용자 이름(이메일)이 비어 있습니다.");
        }
    
        Member member = memberRepository.findByEmail(username);
        if (member == null) {
            log.error("사용자를 찾을 수 없습니다. 입력된 이메일(username): {}", username);
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다. 이메일(username): " + username);
        }
    
        if (member.isSocial()) {
            log.error("소셜 로그인 사용자는 일반 로그인을 할 수 없습니다. 이메일(username): {}", username);
            throw new UsernameNotFoundException("소셜 로그인 사용자는 일반 로그인을 할 수 없습니다.");
        }
    
        return new MemberSecurityDto(
                member.getId(),
                member.getEmail(),
                member.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getRole().toString())),
                member.getName(),
                false,
                null,
                null
        );
    }
    
}
