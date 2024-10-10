package com.brigada.backend.controller;

import com.brigada.backend.dto.response.CoordinatesResponseDTO;
import com.brigada.backend.service.CoordinatesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/coordinates")
@RequiredArgsConstructor
public class CoordinatesController {
    private final CoordinatesService coordinatesService;

    @GetMapping
    public ResponseEntity<List<CoordinatesResponseDTO>> getAllCoordinates() {
        return new ResponseEntity<>(coordinatesService.getAllCoordinates(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoordinatesResponseDTO> getCoordinatesById(@PathVariable Long id) {
        return ResponseEntity.ok(coordinatesService.getCoordinatesById(id));
    }
}
