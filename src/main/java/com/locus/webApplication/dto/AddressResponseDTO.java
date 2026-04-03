package com.locus.webApplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponseDTO {
    private UUID id;
    private String zipCode;
    private String number;
    private String complement;
    private String street;
    private String neighborhood;
    private String city;
    private String state;
    private boolean isPrincipal;
}