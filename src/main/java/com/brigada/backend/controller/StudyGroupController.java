package com.brigada.backend.controller;

import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
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

    @GetMapping
    public ResponseEntity<List<StudyGroupResponseDTO>> getAllStudyGroups(@RequestParam(defaultValue = "1") int page,
                                                                         @RequestParam(defaultValue = "10") int size,
                                                                         @RequestParam(defaultValue = "id") String sortBy) {
        return new ResponseEntity<>(studyGroupService.getAllStudyGroups(page, size, sortBy), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyGroupResponseDTO> getStudyGroupById(@PathVariable int id) {
        return ResponseEntity.ok(studyGroupService.getStudyGroupById(id));
    }

    @PostMapping
    public ResponseEntity<StudyGroupResponseDTO> createStudyGroup(@Valid @RequestBody StudyGroupRequestDTO studyGroupRequestDTO) {
        StudyGroupResponseDTO createdGroup = studyGroupService.createStudyGroup(studyGroupRequestDTO);
        return new ResponseEntity<>(createdGroup, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyGroupResponseDTO> updateStudyGroup(@PathVariable int id, @Valid @RequestBody StudyGroupRequestDTO studyGroupRequestDTO) {
        StudyGroupResponseDTO updatedGroup = studyGroupService.updateStudyGroup(id, studyGroupRequestDTO);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudyGroup(@PathVariable int id) {
        studyGroupService.deleteStudyGroupById(id);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/search") TODO
//    public ResponseEntity<List<StudyGroupResponseDTO>> searchStudyGroupsByName(@RequestParam String name) {
//        List<StudyGroupResponseDTO> studyGroups = studyGroupService.searchStudyGroupsByName(name);
//        return ResponseEntity.ok(studyGroups);
//    }

//    @DeleteMapping("/expelled") TODO
//    public ResponseEntity<Void> deleteByShouldBeExpelled(@RequestParam int shouldBeExpelled) {
//        studyGroupService.deleteByShouldBeExpelled(shouldBeExpelled);
//        return ResponseEntity.noContent().build();
//    }
}
