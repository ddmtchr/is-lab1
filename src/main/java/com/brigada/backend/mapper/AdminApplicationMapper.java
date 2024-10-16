package com.brigada.backend.mapper;

import com.brigada.backend.dto.response.AdminApplicationResponseDTO;
import com.brigada.backend.security.entity.AdminApplication;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AdminApplicationMapper {
    AdminApplicationMapper INSTANCE = Mappers.getMapper(AdminApplicationMapper.class);

    AdminApplicationResponseDTO toAdminApplicationResponseDTO(AdminApplication application);
}
