package com.brigada.backend.mapper;

import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.dto.request.CoordinatesRequestDTO;
import com.brigada.backend.dto.response.CoordinatesResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CoordinatesMapper {
    CoordinatesMapper INSTANCE = Mappers.getMapper(CoordinatesMapper.class);

    @Mapping(target = "id", ignore = true)
    Coordinates toEntity(CoordinatesRequestDTO requestDTO);
    CoordinatesResponseDTO toResponseDTO(Coordinates e);
}
