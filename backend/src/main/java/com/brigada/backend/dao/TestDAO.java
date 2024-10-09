package com.brigada.backend.dao;

import com.brigada.backend.domain.TestEntity;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class TestDAO {
    private final SessionFactory sessionFactory;

//    public void save(TestEntity e) {
//        System.out.println("In dao");
//        Transaction tx = null;
//        try (Session session = sessionFactory.getCurrentSession()) {
//            tx = session.beginTransaction();
//            session.persist(e);
//            tx.commit();
//        } catch (Exception ex) {
//            if (tx != null) {
//                tx.rollback();
//            }
//            ex.printStackTrace();
//        }
//
//    }

    @Transactional
    public void save(TestEntity e) {
        System.out.println("In dao");
        Session session = sessionFactory.getCurrentSession();
        session.persist(e);
        session.flush();
    }
}
