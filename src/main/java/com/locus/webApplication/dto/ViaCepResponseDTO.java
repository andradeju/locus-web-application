package com.locus.webApplication.dto;

import lombok.Data;

@Data
public class ViaCepResponseDTO {
    private String cep;
    private String logradouro;
    private String bairro;
    private String localidade;
    private String uf;
}