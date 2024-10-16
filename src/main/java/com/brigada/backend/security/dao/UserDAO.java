package com.brigada.backend.security.dao;

import com.brigada.backend.security.entity.Role;
import com.brigada.backend.security.entity.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Transactional
public class UserDAO {
    private final SessionFactory sessionFactory;

    public Optional<User> findByUsername(String username) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<User> query = builder.createQuery(User.class);
        Root<User> root = query.from(User.class);
        query.select(root).where(builder.equal(root.get("username"), username));
        User user = session.createQuery(query).uniqueResult();
        return Optional.ofNullable(user);
    }

    public Optional<User> findById(Long id) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<User> query = builder.createQuery(User.class);
        Root<User> root = query.from(User.class);
        query.select(root).where(builder.equal(root.get("id"), id));
        User user = session.createQuery(query).uniqueResult();
        return Optional.ofNullable(user);
    }

    public boolean existsByUsername(String username) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<User> root = query.from(User.class);
        query.select(builder.count(root)).where(builder.equal(root.get("username"), username));
        Long count = session.createQuery(query).uniqueResult();
        return count != null && count > 0;
    }

    public void addUser(User user) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(user);
        session.flush();
    }

    public long countAdmins() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = sessionFactory.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<User> root = query.from(User.class);

        Join<User, Role> roles = root.join("roles");
        query.select(builder.count(root))
                .where(builder.equal(roles, Role.ADMIN));

        return session.createQuery(query).getSingleResult();
    }
}
