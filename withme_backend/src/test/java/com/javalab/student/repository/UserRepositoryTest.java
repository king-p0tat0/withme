package com.javalab.student.repository;

import com.javalab.student.constant.Role;
import com.javalab.student.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    /**
     * 사용자(User) 생성 메소드
     */
    private User createUser(String id, String name, String password, String email, String address, String phone) {
        return User.builder()
                .userId(id)
                .userName(name)
                .password(password)
                .email(email)
                .address(address)
                .phone(phone)
                .role(Role.USER)
                .points(0)
                .build();
    }

    @Test
    @DisplayName("사용자 저장 테스트")
    @Commit
    void saveUserTest() {
        // Given
        User user = createUser("user1", "홍길동", "password123", "user1@example.com", "서울시 강남구", "010-1234-5678");

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getUserId()).isEqualTo("user1");
        assertThat(savedUser.getUserName()).isEqualTo("홍길동");
    }

    @Test
    @DisplayName("사용자 조회 테스트")
    void findUserByIdTest() {
        // Given
        User user = createUser("user2", "김철수", "password456", "user2@example.com", "부산시 해운대구", "010-5678-1234");
        userRepository.save(user);

        // When
        Optional<User> foundUser = userRepository.findById("user2");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUserName()).isEqualTo("김철수");
    }

    @Test
    @DisplayName("사용자 업데이트 테스트")
    void updateUserTest() {
        // Given
        User user = createUser("user3", "박영희", "password789", "user3@example.com", "대구시 중구", "010-9876-5432");
        User savedUser = userRepository.save(user);

        // When
        savedUser.setUserName("변경된 이름");
        savedUser.setEmail("updated@example.com");
        User updatedUser = userRepository.save(savedUser);

        // Then
        assertThat(updatedUser.getUserName()).isEqualTo("변경된 이름");
        assertThat(updatedUser.getEmail()).isEqualTo("updated@example.com");
    }

    @Test
    @DisplayName("사용자 삭제 테스트")
    void deleteUserTest() {
        // Given
        User user = createUser("user4", "이영수", "password000", "user4@example.com", "인천시 남동구", "010-2222-3333");
        User savedUser = userRepository.save(user);

        // When
        userRepository.deleteById(savedUser.getUserId());
        Optional<User> deletedUser = userRepository.findById(savedUser.getUserId());

        // Then
        assertThat(deletedUser).isNotPresent();
    }
}
