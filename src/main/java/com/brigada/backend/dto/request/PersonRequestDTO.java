package com.brigada.backend.dto.request;

import com.brigada.backend.domain.Color;
import com.brigada.backend.domain.Country;
import com.brigada.backend.domain.Person;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PersonRequestDTO {
    private Long id = null;
    @NotBlank
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private LocationRequestDTO location;
    @Positive
    private Float weight;
    private Country nationality;

    public boolean equalsToEntity(Person e) {
        if (!Objects.equals(name, e.getName())) return false;
        if (eyeColor != e.getEyeColor()) return false;
        if (hairColor != e.getHairColor()) return false;
        if (!Objects.equals(weight, e.getWeight())) return false;
        return nationality == e.getNationality();
    }
}
