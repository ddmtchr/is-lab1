package com.brigada.backend.service;

import com.brigada.backend.dao.CoordinatesDAO;
import com.brigada.backend.dao.LocationDAO;
import com.brigada.backend.dao.PersonDAO;
import com.brigada.backend.dao.StudyGroupDAO;
import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.Person;
import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.GroupCountByIdDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.CoordinatesMapper;
import com.brigada.backend.mapper.LocationMapper;
import com.brigada.backend.mapper.PersonMapper;
import com.brigada.backend.mapper.StudyGroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {
    private final StudyGroupDAO dao;
    private final CoordinatesDAO coordinatesDAO;
    private final PersonDAO personDAO;
    private final LocationDAO locationDAO;

    @Transactional
    public StudyGroupResponseDTO createStudyGroup(StudyGroupRequestDTO requestDTO) {
        StudyGroup entity = StudyGroupMapper.INSTANCE.toEntity(requestDTO);

        if (requestDTO.getCoordinates().getId() != null) {
            Optional<Coordinates> existingCoordinatesOptional = coordinatesDAO.getCoordinatesById(requestDTO.getCoordinates().getId());
            if (existingCoordinatesOptional.isPresent()) {
                Coordinates existingCoordinates = existingCoordinatesOptional.get();
                entity.setCoordinates(existingCoordinates);
            } else {
                coordinatesDAO.createCoordinates(entity.getCoordinates());
            }
        } else {
            coordinatesDAO.createCoordinates(entity.getCoordinates());
        }

        if (requestDTO.getGroupAdmin().getId() != null) {
            Optional<Person> existingPersonOptional = personDAO.getPersonById(requestDTO.getGroupAdmin().getId());
            if (existingPersonOptional.isPresent()) {
                Person existingPerson = existingPersonOptional.get();
                entity.setGroupAdmin(existingPerson);
            } else {
                personDAO.createPerson(entity.getGroupAdmin());
            }

        } else {
            personDAO.createPerson(entity.getGroupAdmin());
        }

        StudyGroup created = dao.createStudyGroup(entity);
        return StudyGroupMapper.INSTANCE.toResponseDTO(created);
    }

    public StudyGroupResponseDTO getStudyGroupById(Integer id) {
        Optional<StudyGroup> optional = dao.getStudyGroupById(id);
        if (optional.isEmpty()) throw new NotFoundException();
        return StudyGroupMapper.INSTANCE.toResponseDTO(optional.get());
    }

    public List<StudyGroupResponseDTO> getAllStudyGroups(int page, int size, String sortBy) {
        return dao.getAllStudyGroups(page, size, sortBy).stream()
                .map(StudyGroupMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudyGroupResponseDTO updateStudyGroup(int id, StudyGroupRequestDTO requestDTO) {
        Optional<StudyGroup> optional = dao.getStudyGroupById(id);
        if (optional.isEmpty()) throw new NotFoundException();

        StudyGroup existingEntity = optional.get();
        StudyGroup entity = StudyGroupMapper.INSTANCE.toEntity(requestDTO);
        entity.setId(id);
        entity.setCreationDate(existingEntity.getCreationDate());

        handleCoordinatesUpdate(entity, requestDTO, existingEntity.getCoordinates());
        handleGroupAdminUpdate(entity, requestDTO, existingEntity.getGroupAdmin());

        return StudyGroupMapper.INSTANCE.toResponseDTO(dao.updateStudyGroup(entity));
    }

    @Transactional
    public void deleteStudyGroupById(Integer id) {
        Optional<StudyGroup> optional = dao.getStudyGroupById(id);
        if (optional.isEmpty()) return;

        StudyGroup studyGroup = optional.get();
        Coordinates coordinates = studyGroup.getCoordinates();
        Person groupAdmin = studyGroup.getGroupAdmin();

        dao.deleteStudyGroup(studyGroup);

        if (coordinates != null) {
            long countGroupsUsingCoordinates = dao.countGroupsByCoordinatesId(coordinates.getId());
            if (countGroupsUsingCoordinates == 0) {
                coordinatesDAO.deleteCoordinates(coordinates);
            }
        }

        if (groupAdmin != null) {
            long countGroupsUsingAdmin = dao.countGroupsByAdminId(groupAdmin.getId());
            if (countGroupsUsingAdmin == 0) {
                personDAO.deletePerson(groupAdmin);
            }
        }
    }

    public Long countExpelledStudents() {
        return dao.countExpelledStudents();
    }

    public void expelAllStudentsByGroup(int id) {
        Optional<StudyGroup> optional = dao.getStudyGroupById(id);
        if (optional.isEmpty()) throw new NotFoundException();
        StudyGroup old = optional.get();
        old.setExpelledStudents((long) old.getStudentsCount());
        dao.updateStudyGroup(old);
    }

    public List<StudyGroupResponseDTO> searchByName(String prefix) {
        return dao.searchByNamePrefix(prefix).stream()
                .map(StudyGroupMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<GroupCountByIdDTO> getGroupCountById() {
        List<Object[]> list = dao.getGroupCountById();
        return list.stream().map((Object[] o) -> new GroupCountByIdDTO((Integer) o[0], (Long) o[1])).collect(Collectors.toList());
    }

    public void deleteByShouldBeExpelled(Integer value) {
        dao.deleteByShouldBeExpelled(value);
    }

    private void handleCoordinatesUpdate(StudyGroup entity, StudyGroupRequestDTO requestDTO, Coordinates existingCoordinates) {
        if (requestDTO.getCoordinates() != null && !requestDTO.getCoordinates().equalsToEntity(existingCoordinates)) {
            long countGroupsUsingCoordinates = dao.countGroupsByCoordinatesId(existingCoordinates.getId());
            Optional<Coordinates> existingSimilarCoordinates = coordinatesDAO.findByXAndY(
                    requestDTO.getCoordinates().getX(),
                    requestDTO.getCoordinates().getY()
            );

            if (countGroupsUsingCoordinates > 1) {
                // Кто-то еще использует старые координаты
                if (existingSimilarCoordinates.isPresent()) {
                    entity.setCoordinates(existingSimilarCoordinates.get());
                } else {
                    Coordinates newCoordinates = CoordinatesMapper.INSTANCE.toEntity(requestDTO.getCoordinates());
                    coordinatesDAO.createCoordinates(newCoordinates);
                    entity.setCoordinates(newCoordinates);
                }
            } else {
                // Никто больше не использует старые координаты
                if (existingSimilarCoordinates.isPresent()) {
                    entity.setCoordinates(existingSimilarCoordinates.get());
                    coordinatesDAO.deleteCoordinates(existingCoordinates);
                } else {
                    existingCoordinates.setX(requestDTO.getCoordinates().getX());
                    existingCoordinates.setY(requestDTO.getCoordinates().getY());
                    coordinatesDAO.merge(existingCoordinates);
                    entity.setCoordinates(existingCoordinates);
                }
            }
        } else {
            entity.setCoordinates(existingCoordinates);
        }
    }

    private void handleGroupAdminUpdate(StudyGroup entity, StudyGroupRequestDTO requestDTO, Person existingAdmin) {
        if (requestDTO.getGroupAdmin() != null && !requestDTO.getGroupAdmin().equalsToEntity(existingAdmin)) {
            long countGroupsUsingAdmin = dao.countGroupsByAdminId(existingAdmin.getId());
            Optional<Person> existingSimilarPerson = personDAO.findPersonByAllFields(PersonMapper.INSTANCE.toEntity(requestDTO.getGroupAdmin()));

            if (countGroupsUsingAdmin > 1) {
                if (existingSimilarPerson.isPresent()) {
                    entity.setGroupAdmin(existingSimilarPerson.get());
                } else {
                    Person newAdmin = PersonMapper.INSTANCE.toEntity(requestDTO.getGroupAdmin());
                    personDAO.createPerson(newAdmin);
                    entity.setGroupAdmin(newAdmin);
                }
            } else {
                if (existingSimilarPerson.isPresent()) {
                    entity.setGroupAdmin(existingSimilarPerson.get());
                    personDAO.deletePerson(existingAdmin);
                } else {
                    existingAdmin.setName(requestDTO.getGroupAdmin().getName());
                    existingAdmin.setLocation(LocationMapper.INSTANCE.toEntity(requestDTO.getGroupAdmin().getLocation()));
                    existingAdmin.setWeight(requestDTO.getGroupAdmin().getWeight());
                    existingAdmin.setNationality(requestDTO.getGroupAdmin().getNationality());
                    existingAdmin.setEyeColor(requestDTO.getGroupAdmin().getEyeColor());
                    existingAdmin.setHairColor(requestDTO.getGroupAdmin().getHairColor());
                    personDAO.merge(existingAdmin);
                    entity.setGroupAdmin(existingAdmin);
                }
            }
        } else {
            entity.setGroupAdmin(existingAdmin);
        }
    }
}
