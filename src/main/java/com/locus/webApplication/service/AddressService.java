package com.locus.webApplication.service;

import com.locus.webApplication.dto.AddressResponseDTO;
import com.locus.webApplication.dto.CreateAddressDTO;
import com.locus.webApplication.model.Address;
import com.locus.webApplication.model.User;
import com.locus.webApplication.repository.AddressRepository;
import com.locus.webApplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressResponseDTO createAddress(UUID userId, CreateAddressDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (dto.isPrincipal()) {
            addressRepository.findByUserIdAndIsPrincipalTrue(userId)
                    .ifPresent(existing -> {
                        existing.setPrincipal(false);
                        addressRepository.save(existing);
                    });
        }

        Address address = Address.builder()
                .user(user)
                .zipCode(dto.getZipCode())
                .number(dto.getNumber())
                .complement(dto.getComplement())
                .street(dto.getStreet())
                .neighborhood(dto.getNeighborhood())
                .city(dto.getCity())
                .state(dto.getState())
                .isPrincipal(dto.isPrincipal())
                .build();

        Address saved = addressRepository.save(address);
        return toResponseDTO(saved);
    }

    public List<AddressResponseDTO> findByUserId(UUID userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public AddressResponseDTO update(UUID addressId, CreateAddressDTO dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        if (dto.isPrincipal()) {
            addressRepository.findByUserIdAndIsPrincipalTrue(address.getUser().getId())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(addressId)) {
                            existing.setPrincipal(false);
                            addressRepository.save(existing);
                        }
                    });
        }

        address.setZipCode(dto.getZipCode());
        address.setNumber(dto.getNumber());
        address.setComplement(dto.getComplement());
        address.setStreet(dto.getStreet());
        address.setNeighborhood(dto.getNeighborhood());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPrincipal(dto.isPrincipal());

        Address saved = addressRepository.save(address);
        return toResponseDTO(saved);
    }

    public void delete(UUID addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        boolean wasPrincipal = address.isPrincipal();
        UUID userId = address.getUser().getId();

        addressRepository.delete(address);

        if (wasPrincipal) {
            addressRepository.findByUserId(userId)
                    .stream()
                    .findFirst()
                    .ifPresent(next -> {
                        next.setPrincipal(true);
                        addressRepository.save(next);
                    });
        }
    }

    public AddressResponseDTO setPrincipal(UUID addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        addressRepository.findByUserIdAndIsPrincipalTrue(address.getUser().getId())
                .ifPresent(existing -> {
                    existing.setPrincipal(false);
                    addressRepository.save(existing);
                });

        address.setPrincipal(true);
        Address saved = addressRepository.save(address);
        return toResponseDTO(saved);
    }

    private AddressResponseDTO toResponseDTO(Address address) {
        return AddressResponseDTO.builder()
                .id(address.getId())
                .zipCode(address.getZipCode())
                .number(address.getNumber())
                .complement(address.getComplement())
                .street(address.getStreet())
                .neighborhood(address.getNeighborhood())
                .city(address.getCity())
                .state(address.getState())
                .isPrincipal(address.isPrincipal())
                .build();
    }
}