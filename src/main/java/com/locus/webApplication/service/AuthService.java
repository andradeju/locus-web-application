package com.locus.webApplication.service;

import com.locus.webApplication.dto.LoginDTO;
import com.locus.webApplication.dto.UserResponseDTO;
import com.locus.webApplication.model.User;
import com.locus.webApplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO login(LoginDTO dto) {
        User user = userRepository.findByCpf(dto.getCpf())
                .orElseThrow(() -> new RuntimeException("CPF ou senha inválidos"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("CPF ou senha inválidos");
        }

        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .cpf(user.getCpf())
                .birthDate(user.getBirthDate())
                .role(user.getRole())
                .build();
    }
}