package com.brigada.backend.security.dao;

import com.brigada.backend.mapper.UserMapper;
import com.brigada.backend.security.entity.AdminApplication;
import com.brigada.backend.security.entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdminApplicationDAO {
    private final SessionFactory sessionFactory;

    public void addApplication(User user) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(UserMapper.INSTANCE.toAdminApplication(user));
        session.flush();
    }

    public List<AdminApplication> getAllApplications() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<AdminApplication> query = builder.createQuery(AdminApplication.class);
        Root<AdminApplication> root = query.from(AdminApplication.class);
        query.select(root);

        return session.createQuery(query)
                .getResultList();
    }

    public Optional<AdminApplication> getApplicationById(Long id) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<AdminApplication> query = builder.createQuery(AdminApplication.class);
        Root<AdminApplication> root = query.from(AdminApplication.class);

        query.select(root).where(builder.equal(root.get("id"), id));

        List<AdminApplication> result = session.createQuery(query).getResultList();
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));

    }

    public void deleteApplication(AdminApplication application) {
        sessionFactory.getCurrentSession().remove(application);
    }
}
