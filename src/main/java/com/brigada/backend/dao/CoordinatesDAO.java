package com.brigada.backend.dao;

import com.brigada.backend.domain.Coordinates;
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
public class CoordinatesDAO {
    private final SessionFactory sessionFactory;

    public Optional<Coordinates> getCoordinatesById(Long id) {
        Session session = sessionFactory.getCurrentSession();
        Coordinates entity = session.get(Coordinates.class, id);
        return Optional.ofNullable(entity);
    }

    public List<Coordinates> getAllCoordinates() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Coordinates> query = builder.createQuery(Coordinates.class);
        Root<Coordinates> root = query.from(Coordinates.class);
        query.select(root);

        return session.createQuery(query).getResultList();
    }

    public void merge(Coordinates coordinates) {
        Session session = sessionFactory.getCurrentSession();
        session.merge(coordinates);
        session.flush();
    }

    public void createCoordinates(Coordinates coordinates) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(coordinates);
        session.flush();
    }

    public Optional<Coordinates> findByXAndY(Integer x, Integer y) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Coordinates> query = builder.createQuery(Coordinates.class);
        Root<Coordinates> root = query.from(Coordinates.class);

        query.select(root)
                .where(builder.equal(root.get("x"), x),
                        builder.equal(root.get("y"), y));

        List<Coordinates> result = session.createQuery(query).getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public void deleteCoordinates(Coordinates coordinates) {
        sessionFactory.getCurrentSession().remove(coordinates);
    }
}
