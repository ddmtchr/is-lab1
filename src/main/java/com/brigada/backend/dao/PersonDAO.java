package com.brigada.backend.dao;

import com.brigada.backend.domain.Person;
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
public class PersonDAO {
    private final SessionFactory sessionFactory;

    public Optional<Person> getPersonById(Long id) {
        Session session = sessionFactory.getCurrentSession();
        Person entity = session.get(Person.class, id);
        return Optional.ofNullable(entity);
    }

    public List<Person> getAllPersons() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Person> query = builder.createQuery(Person.class);
        Root<Person> root = query.from(Person.class);
        query.select(root);

        return session.createQuery(query).getResultList();
    }
}
