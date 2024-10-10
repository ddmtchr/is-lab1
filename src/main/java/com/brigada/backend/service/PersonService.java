package com.brigada.backend.service;

import com.brigada.backend.dao.PersonDAO;
import com.brigada.backend.domain.Person;
import com.brigada.backend.dto.response.PersonResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.PersonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonDAO dao;

    public PersonResponseDTO getPersonById(Long id) {
        Optional<Person> optional = dao.getPersonById(id);
        if (optional.isEmpty()) throw new NotFoundException();
        return PersonMapper.INSTANCE.toResponseDTO(optional.get());
    }

    public List<PersonResponseDTO> getAllPersons() {
        return dao.getAllPersons().stream()
                .map(PersonMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }
}
