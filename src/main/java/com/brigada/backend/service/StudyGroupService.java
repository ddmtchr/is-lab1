package com.brigada.backend.service;

import com.brigada.backend.dao.StudyGroupDAO;
import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.Location;
import com.brigada.backend.domain.Person;
import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.StudyGroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {
    private final StudyGroupDAO dao;

    public StudyGroupResponseDTO createStudyGroup(StudyGroupRequestDTO requestDTO) {
        StudyGroup entity = dao.createStudyGroup(StudyGroupMapper.INSTANCE.toEntity(requestDTO));
        return StudyGroupMapper.INSTANCE.toResponseDTO(entity);
    }

    public StudyGroupResponseDTO getStudyGroupById(int id) {
        Optional<StudyGroup> optional = dao.getStudyGroupById(id);
        if (optional.isEmpty()) throw new NotFoundException();
        return StudyGroupMapper.INSTANCE.toResponseDTO(optional.get());
    }

    public List<StudyGroupResponseDTO> getAllStudyGroups(int page, int size, String sortBy) {
        return dao.getAllStudyGroups(page, size, sortBy).stream()
                .map(StudyGroupMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    public StudyGroupResponseDTO updateStudyGroup(int id, StudyGroupRequestDTO requestDTO) {
        Optional<StudyGroup> optional = dao.getStudyGroupById(id);
        if (optional.isEmpty()) throw new NotFoundException();
        else {
            StudyGroup existingEntity = optional.get();
            Coordinates existingCoordinates = existingEntity.getCoordinates();
            Person existingGroupAdmin = existingEntity.getGroupAdmin();
            Location existingLocation = existingGroupAdmin.getLocation();

            StudyGroup entity = StudyGroupMapper.INSTANCE.toEntity(requestDTO);
            entity.setId(id);
            entity.setCreationDate(existingEntity.getCreationDate());

            if (requestDTO.getCoordinates() != null && requestDTO.getCoordinates().equalsToEntity(existingCoordinates)) {
                entity.getCoordinates().setId(existingCoordinates.getId());
            }
            if (requestDTO.getGroupAdmin() != null) {
                if (requestDTO.getGroupAdmin().equalsToEntity(existingGroupAdmin)) {
                    entity.setGroupAdmin(existingGroupAdmin);
                }
                if (requestDTO.getGroupAdmin().getLocation() != null && requestDTO.getGroupAdmin().getLocation().equalsToEntity(existingLocation)) {
                    entity.getGroupAdmin().setLocation(existingLocation);
                }
            }

            return StudyGroupMapper.INSTANCE.toResponseDTO(dao.updateStudyGroup(entity));
        }
    }

    public void deleteStudyGroupById(int id) {
        dao.deleteStudyGroupById(id);
    }

    public Long countExpelledStudents() {
        return dao.countExpelledStudents();
    }
}
