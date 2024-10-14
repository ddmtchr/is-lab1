package com.brigada.backend.service;

import com.brigada.backend.dao.LocationDAO;
import com.brigada.backend.domain.Location;
import com.brigada.backend.dto.response.LocationResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationDAO dao;

    public LocationResponseDTO getLocationById(Long id) {
        Optional<Location> optional = dao.getLocationById(id);
        if (optional.isEmpty()) throw new NotFoundException("Location doesn't exist");
        return LocationMapper.INSTANCE.toResponseDTO(optional.get());
    }

    public List<LocationResponseDTO> getAllLocations() {
        return dao.getAllLocations().stream()
                .map(LocationMapper.INSTANCE::toResponseDTO)
                .collect(Collectors.toList());
    }
}
