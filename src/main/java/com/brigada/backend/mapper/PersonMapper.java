package com.brigada.backend.mapper;

import com.brigada.backend.domain.Person;
import com.brigada.backend.dto.request.PersonRequestDTO;
import com.brigada.backend.dto.response.PersonResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PersonMapper {
    PersonMapper INSTANCE = Mappers.getMapper(PersonMapper.class);

    @Mapping(target = "id", ignore = true)
    Person toEntity(PersonRequestDTO requestDTO);
    PersonResponseDTO toResponseDTO(Person e);
}
