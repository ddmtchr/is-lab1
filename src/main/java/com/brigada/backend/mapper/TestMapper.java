package com.brigada.backend.mapper;

import com.brigada.backend.domain.TestEntity;
import com.brigada.backend.dto.response.TestEntityResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TestMapper {
    TestMapper INSTANCE = Mappers.getMapper(TestMapper.class);

    @Mapping(target = "creatorId", source = "creator.id")
    TestEntityResponseDTO toResponseDTO(TestEntity e);
}
