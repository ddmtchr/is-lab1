package com.brigada.backend.audit.dao;

import com.brigada.backend.audit.entity.StudyGroupLog;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class StudyGroupLogDAO {
    private final SessionFactory sessionFactory;

    public void createLog(StudyGroupLog log) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(log);
        session.flush();
    }
}
