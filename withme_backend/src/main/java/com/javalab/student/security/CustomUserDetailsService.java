package com.javalab.student.security;

import com.javalab.student.entity.Member;
import com.javalab.student.repository.MemberRepository;
import com.javalab.student.security.dto.MemberSecurityDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

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
     *  - 여기서 반환된 객체는 아직 인증이 완료되지 않았으며 인증은 AuthenticationManager가 수행
     *  - 여기서는 사용자 정보를 가져와서 UserDetails 객체로 만들어서 반환, 나머지는 Spring Security가 처리
     *    즉 인증이 성공하면 UserDetails 객체를 SecurityContextHolder에 저장.
     * @param username
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("CustomUserDetailsService loadUserByUsername username: {}", username);

        // 이메일로 회원을 조회 (Optional<Member> 반환)
        Optional<Member> optionalMember = memberRepository.findByEmail(username);

        // 해당 이메일을 가진 사용자가 없을 경우 예외를 던짐
        Member member = optionalMember.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // 소셜 로그인 사용자의 경우 예외 처리
        if (member.isSocial()) {
            throw new UsernameNotFoundException("소셜 로그인 사용자는 일반 로그인을 할 수 없습니다. 회원가입을 하세요.");
        }

        // MemberSecurityDto 객체로 변환하여 반환
        return new MemberSecurityDto(
                member.getId(), // getId()로 수정
                member.getEmail(),
                member.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getRole().toString())),
                member.getUserName(),
                member.isSocial(), // 소셜 로그인 여부 설정
                null, // 필요시 추가 데이터
                null  // 필요시 추가 데이터
        );
    }
}
