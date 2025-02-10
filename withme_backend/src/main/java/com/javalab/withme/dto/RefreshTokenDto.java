package com.javalab.withme.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class RefreshTokenDto {
    private String email;
    private String refreshToken;
}
