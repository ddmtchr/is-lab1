package com.brigada.backend.controller;

import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import com.brigada.backend.security.jwt.JwtUtils;
import com.brigada.backend.service.StudyGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {
    private final StudyGroupService studyGroupService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<StudyGroupResponseDTO>> getAllStudyGroups(@RequestParam(defaultValue = "1") int page,
                                                                         @RequestParam(defaultValue = "10") int size,
                                                                         @RequestParam(defaultValue = "id") String sortBy) {
        return new ResponseEntity<>(studyGroupService.getAllStudyGroups(page, size, sortBy), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyGroupResponseDTO> getStudyGroupById(@PathVariable Integer id) {
        return ResponseEntity.ok(studyGroupService.getStudyGroupById(id));
    }

    @PostMapping // ACHTUNG если передаешь id вложенных сущностей, он будет пытаться взять существующие, а не создать новые
    public ResponseEntity<StudyGroupResponseDTO> createStudyGroup(@Valid @RequestBody StudyGroupRequestDTO studyGroupRequestDTO) {
        String username = jwtUtils.getCurrentUser().getUsername();

        StudyGroupResponseDTO createdGroup = studyGroupService.createStudyGroup(studyGroupRequestDTO, username);
        return new ResponseEntity<>(createdGroup, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyGroupResponseDTO> updateStudyGroup(@PathVariable int id, @Valid @RequestBody StudyGroupRequestDTO studyGroupRequestDTO) {
        String username = jwtUtils.getCurrentUser().getUsername();

        StudyGroupResponseDTO updatedGroup = studyGroupService.updateStudyGroup(id, studyGroupRequestDTO, username);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudyGroup(@PathVariable int id) {
        String username = jwtUtils.getCurrentUser().getUsername();

        studyGroupService.deleteStudyGroupById(id, username);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/search") TODO
//    public ResponseEntity<List<StudyGroupResponseDTO>> searchStudyGroupsByName(@RequestParam String name) {
//        List<StudyGroupResponseDTO> studyGroups = studyGroupService.searchStudyGroupsByName(name);
//        return ResponseEntity.ok(studyGroups);
//    }

}
