package com.brigada.backend.service;

import com.brigada.backend.dao.CoordinatesDAO;
import com.brigada.backend.dao.LocationDAO;
import com.brigada.backend.dao.PersonDAO;
import com.brigada.backend.dao.StudyGroupDAO;
import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.Person;
import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.dto.request.CoordinatesRequestDTO;
import com.brigada.backend.dto.request.PersonRequestDTO;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.GroupCountByIdDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import com.brigada.backend.exception.ConstraintViolationException;
import com.brigada.backend.exception.NoPermissionException;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.CoordinatesMapper;
import com.brigada.backend.mapper.LocationMapper;
import com.brigada.backend.mapper.PersonMapper;
import com.brigada.backend.mapper.StudyGroupMapper;
import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
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
    private final UserDAO userDAO;
    private final PermissionService permissionService;

    @Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_UNCOMMITTED)
    public StudyGroupResponseDTO createStudyGroup(StudyGroupRequestDTO requestDTO, String username) {
        StudyGroup entity = StudyGroupMapper.INSTANCE.toEntity(requestDTO);

        checkUniqueConstraint(requestDTO);

        User user = getUserByUsername(username);
        entity.setCreatedBy(user);

        handleCoordinatesCreation(entity, requestDTO.getCoordinates(), user);
        handleGroupAdminCreation(entity, requestDTO.getGroupAdmin(), user);

        StudyGroup created = dao.createStudyGroup(entity);
        return StudyGroupMapper.INSTANCE.toResponseDTO(created);
    }

    @Transactional
    public StudyGroupResponseDTO getStudyGroupById(Integer id) {
        StudyGroup studyGroup = dao.getStudyGroupById(id)
                .orElseThrow(() -> new NotFoundException("Study group doesn't exist"));
        return StudyGroupMapper.INSTANCE.toResponseDTO(studyGroup);
    }

    @Transactional
    public List<StudyGroupResponseDTO> getAllStudyGroups(Integer page, Integer size, String sortBy) {
        if (page != null && size != null) {
            return dao.getAllStudyGroups(page, size, sortBy).stream()
                    .map(StudyGroupMapper.INSTANCE::toResponseDTO)
                    .collect(Collectors.toList());
        }
        return dao.getAllStudyGroups(sortBy).stream()
                .map(StudyGroupMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public StudyGroupResponseDTO updateStudyGroup(int id, StudyGroupRequestDTO requestDTO, String username) {
        User user = getUserByUsername(username);

        StudyGroup existingEntity = dao.getStudyGroupById(id)
                .orElseThrow(() -> new NotFoundException("Study group doesn't exist"));

        checkPermission(user, existingEntity);
        checkUniqueConstraint(requestDTO);

        StudyGroup entity = StudyGroupMapper.INSTANCE.toEntity(requestDTO);
        entity.setId(id);
        entity.setCreationDate(existingEntity.getCreationDate());
        entity.setCreatedBy(existingEntity.getCreatedBy());

        handleCoordinatesUpdate(entity, requestDTO, existingEntity.getCoordinates(), user);
        handleGroupAdminUpdate(entity, requestDTO, existingEntity.getGroupAdmin(), user);

        return StudyGroupMapper.INSTANCE.toResponseDTO(dao.updateStudyGroup(entity));
    }

    @Transactional
    public void deleteStudyGroupById(Integer id, String username) {
        User user = getUserByUsername(username);

        StudyGroup studyGroup = dao.getStudyGroupById(id)
                .orElse(null);

        if (studyGroup == null) return;

        checkPermission(user, studyGroup);

        dao.deleteStudyGroup(studyGroup);

        cleanUpUnusedCoordinates(studyGroup.getCoordinates(), user);
        cleanUpUnusedAdmin(studyGroup.getGroupAdmin(), user);
    }

    public Long countExpelledStudents() {
        return dao.countExpelledStudents();
    }

    @Transactional
    public void expelAllStudentsByGroup(int id, String username) {
        User user = getUserByUsername(username);

        StudyGroup studyGroup = dao.getStudyGroupById(id)
                .orElseThrow(() -> new NotFoundException("Study group doesn't exist"));

        checkPermission(user, studyGroup);

        studyGroup.setExpelledStudents((long) studyGroup.getStudentsCount());
        dao.updateStudyGroup(studyGroup);
    }

    @Transactional
    public List<StudyGroupResponseDTO> searchByName(String prefix) {
        return dao.searchByNamePrefix(prefix).stream()
                .map(StudyGroupMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<GroupCountByIdDTO> getGroupCountById() {
        List<Object[]> list = dao.getGroupCountById();
        return list.stream()
                .map((Object[] o) -> new GroupCountByIdDTO((Integer) o[0], (Long) o[1]))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Integer> deleteByShouldBeExpelled(Integer value, String username) {
        User user = getUserByUsername(username);
        return dao.deleteByShouldBeExpelled(value, user);
    }

    private void handleCoordinatesUpdate(StudyGroup entity, StudyGroupRequestDTO requestDTO, Coordinates existingCoordinates, User user) {
        if (requestDTO.getCoordinates() != null && !requestDTO.getCoordinates().equalsToEntity(existingCoordinates)) {
            long countGroupsUsingCoordinates = dao.countGroupsByCoordinatesId(existingCoordinates.getId(), user);
            Optional<Coordinates> existingSimilarCoordinates = coordinatesDAO.findByXAndYAndUser(
                    requestDTO.getCoordinates().getX(),
                    requestDTO.getCoordinates().getY(),
                    user
            );

            if (countGroupsUsingCoordinates > 1) {
                // Кто-то еще использует старые координаты
                if (existingSimilarCoordinates.isPresent()) {
                    entity.setCoordinates(existingSimilarCoordinates.get());
                } else {
                    Coordinates newCoordinates = CoordinatesMapper.INSTANCE.toEntity(requestDTO.getCoordinates());
                    newCoordinates.setCreatedBy(user);
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

    private void handleGroupAdminUpdate(StudyGroup entity, StudyGroupRequestDTO requestDTO, Person existingAdmin, User user) {
        if (requestDTO.getGroupAdmin() != null && !requestDTO.getGroupAdmin().equalsToEntity(existingAdmin)) {
            long countGroupsUsingAdmin = dao.countGroupsByAdminId(existingAdmin.getId(), user);
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

    private User getUserByUsername(String username) {
        return userDAO.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void handleCoordinatesCreation(StudyGroup entity, CoordinatesRequestDTO coordinatesRequestDTO, User user) {
        if (coordinatesRequestDTO.getId() != null) {
            coordinatesDAO.getCoordinatesByIdAndUser(coordinatesRequestDTO.getId(), user)
                    .ifPresentOrElse(
                            entity::setCoordinates,
                            () -> createNewCoordinates(entity, user)
                    );
        } else {
            createNewCoordinates(entity, user);
        }
    }

    private void createNewCoordinates(StudyGroup entity, User user) {
        entity.getCoordinates().setCreatedBy(user);
        coordinatesDAO.createCoordinates(entity.getCoordinates());
    }

    private void handleGroupAdminCreation(StudyGroup entity, PersonRequestDTO personRequestDTO, User user) {
        if (personRequestDTO.getId() != null) {
            personDAO.getPersonByIdAndUser(personRequestDTO.getId(), user)
                    .ifPresentOrElse(
                            entity::setGroupAdmin,
                            () -> createNewGroupAdmin(entity, user)
                    );
        } else {
            createNewGroupAdmin(entity, user);
        }
    }

    private void createNewGroupAdmin(StudyGroup entity, User user) {
        entity.getGroupAdmin().setCreatedBy(user);
        personDAO.createPerson(entity.getGroupAdmin());
    }

    private void cleanUpUnusedCoordinates(Coordinates coordinates, User user) {
        if (coordinates != null && dao.countGroupsByCoordinatesId(coordinates.getId(), user) == 0) {
            coordinatesDAO.deleteCoordinates(coordinates);
        }
    }

    private void cleanUpUnusedAdmin(Person admin, User user) {
        if (admin != null && dao.countGroupsByAdminId(admin.getId(), user) == 0) {
            personDAO.deletePerson(admin);
        }
    }

    private void checkPermission(User user, StudyGroup studyGroup) {
        if (!permissionService.canEditOrDelete(user, studyGroup)) throw new NoPermissionException("No permission to edit this object");
    }

    private void checkUniqueConstraint(StudyGroupRequestDTO studyGroupRequestDTO) {
        if (dao.existsByName(studyGroupRequestDTO.getName())) throw new ConstraintViolationException("Name must be unique");
    }
}

