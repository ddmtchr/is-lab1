package com.brigada.backend.controller;

import com.brigada.backend.dto.response.PersonResponseDTO;
import com.brigada.backend.security.jwt.JwtUtils;
import com.brigada.backend.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
@RequiredArgsConstructor
public class PersonController {
    private final PersonService personService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<PersonResponseDTO>> getAllPersons() {
        String username = jwtUtils.getCurrentUser().getUsername();
        return new ResponseEntity<>(personService.getAllPersonsByUser(username), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonResponseDTO> getPersonById(@PathVariable Long id) {
        return ResponseEntity.ok(personService.getPersonById(id));
    }

}
