package com.brigada.backend.dao;

import com.brigada.backend.domain.ImportHistory;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional
public class ImportHistoryDAO {
    private final SessionFactory sessionFactory;

    public List<ImportHistory> getAllImportHistory() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<ImportHistory> query = builder.createQuery(ImportHistory.class);
        Root<ImportHistory> root = query.from(ImportHistory.class);
        query.select(root);

        return session.createQuery(query).getResultList();
    }

    public List<ImportHistory> getUsersImportHistory(String username) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<ImportHistory> query = builder.createQuery(ImportHistory.class);
        Root<ImportHistory> root = query.from(ImportHistory.class);
        query.select(root).where(builder.equal(root.get("user").get("username"), username));

        return session.createQuery(query).getResultList();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ImportHistory addImportHistory(ImportHistory importHistory) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(importHistory);
        session.flush();
        return importHistory;
    }
}
