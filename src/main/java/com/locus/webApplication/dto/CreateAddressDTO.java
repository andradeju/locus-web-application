package com.locus.webApplication.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAddressDTO {
    private String zipCode;
    private String number;
    private String complement;
    private String street;
    private String neighborhood;
    private String city;
    private String state;
    @JsonProperty("isPrincipal")
    private boolean isPrincipal;
}