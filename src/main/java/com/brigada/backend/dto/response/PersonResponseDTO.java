package com.brigada.backend.dto.response;

import com.brigada.backend.domain.Color;
import com.brigada.backend.domain.Country;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PersonResponseDTO {
    private Long id;
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private LocationResponseDTO location;
    private Float weight;
    private Country nationality;
}
