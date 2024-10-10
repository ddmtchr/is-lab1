package com.brigada.backend.service;

import com.brigada.backend.dao.CoordinatesDAO;
import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.dto.response.CoordinatesResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.CoordinatesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoordinatesService {
    private final CoordinatesDAO dao;

    public CoordinatesResponseDTO getCoordinatesById(Long id) {
        Optional<Coordinates> optional = dao.getCoordinatesById(id);
        if (optional.isEmpty()) throw new NotFoundException();
        return CoordinatesMapper.INSTANCE.toResponseDTO(optional.get());
    }

    public List<CoordinatesResponseDTO> getAllCoordinates() {
        return dao.getAllCoordinates().stream()
                .map(CoordinatesMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }
}
