package com.brigada.backend.mapper;

import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface StudyGroupMapper {
    StudyGroupMapper INSTANCE = Mappers.getMapper(StudyGroupMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    StudyGroup toEntity(StudyGroupRequestDTO requestDTO);

    @Mapping(target = "createdBy", source = "createdBy.id")
    StudyGroupResponseDTO toResponseDTO(StudyGroup e);
}
