package com.brigada.backend.dao;

import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.Location;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class LocationDAO {
    private final SessionFactory sessionFactory;

    @Transactional
    public Location createLocation(Location location) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(location);
        session.flush();
        return location;
    }

    @Transactional
    public Location updateLocation(Location entity) {
        Session session = sessionFactory.getCurrentSession();
        return session.merge(entity);
    }
}
