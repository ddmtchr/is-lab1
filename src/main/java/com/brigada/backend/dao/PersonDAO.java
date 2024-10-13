package com.brigada.backend.dao;

import com.brigada.backend.domain.Person;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    public void createPerson(Person person) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(person);
        session.flush();
    }

    public Optional<Person> findPersonByAllFields(Person person) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Person> query = builder.createQuery(Person.class);
        Root<Person> root = query.from(Person.class);

        List<Predicate> predicates = new ArrayList<>();

        if (person.getName() != null) predicates.add(builder.equal(root.get("name"), person.getName()));
        if (person.getEyeColor() != null) predicates.add(builder.equal(root.get("eyeColor"), person.getEyeColor()));
        if (person.getHairColor() != null) predicates.add(builder.equal(root.get("hairColor"), person.getHairColor()));
        if (person.getWeight() != null) predicates.add(builder.equal(root.get("weight"), person.getWeight()));
        if (person.getNationality() != null) predicates.add(builder.equal(root.get("nationality"), person.getNationality()));

        query.select(root).where(builder.and(predicates.toArray(new Predicate[0])));

        List<Person> result = session.createQuery(query).getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public void merge(Person person) {
        Session session = sessionFactory.getCurrentSession();
        session.merge(person);
        session.flush();
    }

    public void deletePerson(Person person) {
        sessionFactory.getCurrentSession().remove(person);
    }
}
