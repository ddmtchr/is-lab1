package com.brigada.backend.controller;

import com.brigada.backend.dto.response.GroupCountByIdDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import com.brigada.backend.service.StudyGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/special")
@RequiredArgsConstructor
public class SpecialOperationsController {
    private final StudyGroupService studyGroupService;

    @GetMapping("/expelled")
    public ResponseEntity<Long> getAllExpelledStudents() {
        return new ResponseEntity<>(studyGroupService.countExpelledStudents(), HttpStatus.OK);
    }

    @GetMapping("/search-by-name")
    public ResponseEntity<List<StudyGroupResponseDTO>> searchByName(@RequestParam String prefix) {
        return new ResponseEntity<>(studyGroupService.searchByName(prefix), HttpStatus.OK);
    }

    @GetMapping("/count-group-by-id")
    public ResponseEntity<List<GroupCountByIdDTO>> getGroupCountById() {
        return new ResponseEntity<>(studyGroupService.getGroupCountById(), HttpStatus.OK);
    }

    @PutMapping("/expel/{id}")
    public ResponseEntity<Void> expelAllStudentsByGroup(@PathVariable Integer id) {
        studyGroupService.expelAllStudentsByGroup(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-by-should-be-expelled")
    public ResponseEntity<Void> deleteByShouldBeExpelled(@RequestParam Integer value) {
        studyGroupService.deleteByShouldBeExpelled(value);
        return ResponseEntity.noContent().build();
    }
}
