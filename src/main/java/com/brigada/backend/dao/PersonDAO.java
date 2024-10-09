package com.brigada.backend.dao;

import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.Person;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class PersonDAO {
    private final SessionFactory sessionFactory;
    private final LocationDAO locationDAO;

    @Transactional
    public Person createPerson(Person person) {
        Session session = sessionFactory.getCurrentSession();
//        locationDAO.createLocation(person.getLocation());
        session.persist(person);
        session.flush();
        return person;
    }

    @Transactional
    public Person updatePerson(Person entity) {
        Session session = sessionFactory.getCurrentSession();
        return session.merge(entity);
    }
}
