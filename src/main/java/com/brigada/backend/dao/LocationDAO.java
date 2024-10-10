package com.brigada.backend.dao;

import com.brigada.backend.domain.Location;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class LocationDAO {
    private final SessionFactory sessionFactory;

    public Optional<Location> getLocationById(Long id) {
        Session session = sessionFactory.getCurrentSession();
        Location entity = session.get(Location.class, id);
        return Optional.ofNullable(entity);
    }

    public List<Location> getAllLocations() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Location> query = builder.createQuery(Location.class);
        Root<Location> root = query.from(Location.class);
        query.select(root);

        return session.createQuery(query).getResultList();
    }
}
