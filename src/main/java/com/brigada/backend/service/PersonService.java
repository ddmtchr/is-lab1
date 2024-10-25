package com.brigada.backend.service;

import com.brigada.backend.dao.PersonDAO;
import com.brigada.backend.domain.Person;
import com.brigada.backend.dto.response.PersonResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.PersonMapper;
import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {
    private final PersonDAO dao;
    private final UserDAO userDAO;

    public PersonResponseDTO getPersonById(Long id) {
        Optional<Person> optional = dao.getPersonById(id);
        if (optional.isEmpty()) throw new NotFoundException("Person doesn't exist");
        return PersonMapper.INSTANCE.toResponseDTO(optional.get());
    }

    public List<PersonResponseDTO> getAllPersonsByUser(String username) {
        User user = userDAO.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        return dao.getAllPersonsByUser(user).stream()
                .map(PersonMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }
}
