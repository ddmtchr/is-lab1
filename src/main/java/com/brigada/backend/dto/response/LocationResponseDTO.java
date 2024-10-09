package com.brigada.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LocationResponseDTO {
    private Long id;
    private Long x;
    private float y;
    private Long z;
    private String name;
}
