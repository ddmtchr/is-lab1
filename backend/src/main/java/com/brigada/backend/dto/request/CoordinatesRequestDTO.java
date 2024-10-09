package com.brigada.backend.dto.request;

import com.brigada.backend.domain.Coordinates;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CoordinatesRequestDTO {
    private Integer x;
    private int y;

    public boolean equalsToEntity(Coordinates e) {
        if (!Objects.equals(x, e.getX())) return false;
        return y == e.getY();
    }
}
