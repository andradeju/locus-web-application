package com.locus.webApplication.controller;

import com.locus.webApplication.dto.AddressResponseDTO;
import com.locus.webApplication.dto.CreateAddressDTO;
import com.locus.webApplication.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/users/{userId}/addresses")
    public ResponseEntity<AddressResponseDTO> create(
            @PathVariable UUID userId,
            @RequestBody CreateAddressDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.createAddress(userId, dto));
    }

    @GetMapping("/users/{userId}/addresses")
    public ResponseEntity<List<AddressResponseDTO>> findByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(addressService.findByUserId(userId));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<AddressResponseDTO> update(
            @PathVariable UUID id,
            @RequestBody CreateAddressDTO dto) {
        return ResponseEntity.ok(addressService.update(id, dto));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        addressService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/addresses/{id}/principal")
    public ResponseEntity<AddressResponseDTO> setPrincipal(@PathVariable UUID id) {
        return ResponseEntity.ok(addressService.setPrincipal(id));
    }
}