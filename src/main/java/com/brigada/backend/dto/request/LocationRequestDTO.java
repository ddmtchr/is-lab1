package com.brigada.backend.dto.request;

import com.brigada.backend.domain.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LocationRequestDTO {
    private Long x;
    private float y;
    private Long z;
    private String name;

    public boolean equalsToEntity(Location e) {
        if (!Objects.equals(x, e.getX())) return false;
        if (!Objects.equals(z, e.getZ())) return false;
        if (!name.equals(e.getName())) return false;
        return y == e.getY();
    }
}
