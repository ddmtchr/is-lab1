package com.brigada.backend.dao;

import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.dto.request.CoordinatesRequestDTO;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.CoordinatesResponseDTO;
import com.brigada.backend.dto.response.StudyGroupResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.StudyGroupMapper;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CoordinatesDAO {
    private final SessionFactory sessionFactory;

    @Transactional
    public Coordinates createCoordinates(Coordinates coordinates) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(coordinates);
        session.flush();
        return coordinates;
    }

    @Transactional
    public Coordinates updateCoordinates(Coordinates entity) {
        Session session = sessionFactory.getCurrentSession();
        return session.merge(entity);
    }
}
