package com.brigada.backend.mapper;

import com.brigada.backend.domain.Location;
import com.brigada.backend.dto.request.LocationRequestDTO;
import com.brigada.backend.dto.response.LocationResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface LocationMapper {
    LocationMapper INSTANCE = Mappers.getMapper(LocationMapper.class);

    @Mapping(target = "id", ignore = true)
    Location toEntity(LocationRequestDTO requestDTO);
    LocationResponseDTO toResponseDTO(Location e);
}
