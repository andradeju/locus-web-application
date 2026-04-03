package com.locus.webApplication.service;

import com.locus.webApplication.dto.CreateUserDTO;
import com.locus.webApplication.dto.UserResponseDTO;
import com.locus.webApplication.model.Role;
import com.locus.webApplication.model.User;
import com.locus.webApplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO createUser(CreateUserDTO dto) {
        if (userRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        User user = User.builder()
                .name(dto.getName())
                .cpf(dto.getCpf())
                .birthDate(LocalDate.parse(dto.getBirthDate()))
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);
        return toResponseDTO(saved);
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return toResponseDTO(user);
    }

    private UserResponseDTO toResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .cpf(user.getCpf())
                .birthDate(user.getBirthDate())
                .role(user.getRole())
                .build();
    }
}