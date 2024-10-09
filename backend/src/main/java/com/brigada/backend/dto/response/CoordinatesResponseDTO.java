package com.brigada.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CoordinatesResponseDTO {
    private Long id;
    private Integer x;
    private int y;
}
