package com.brigada.backend.dao;

import com.brigada.backend.domain.TestEntity;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class TestDAO {
    private final SessionFactory sessionFactory;

    @Transactional
    public void save(TestEntity e) {
        System.out.println("In dao");
        Session session = sessionFactory.getCurrentSession();
        session.persist(e);
        session.flush();
    }

    @Transactional
    public List<TestEntity> get() {
        System.out.println("In dao");
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<TestEntity> query = builder.createQuery(TestEntity.class);
        Root<TestEntity> root = query.from(TestEntity.class);
        query.select(root);

        return session.createQuery(query)
                .getResultList();
    }
}
