package com.brigada.backend.dao;

import com.brigada.backend.domain.StudyGroup;
import jakarta.persistence.criteria.*;
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
public class StudyGroupDAO {
    private final SessionFactory sessionFactory;

    public StudyGroup createStudyGroup(StudyGroup studyGroup) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(studyGroup);
        session.flush();
        return studyGroup;
    }

    public Optional<StudyGroup> getStudyGroupById(Integer id) {
        Session session = sessionFactory.getCurrentSession();
        StudyGroup entity = session.get(StudyGroup.class, id);
        return Optional.ofNullable(entity);
    }

    public List<StudyGroup> getAllStudyGroups(int page, int size, String sortBy) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = builder.createQuery(StudyGroup.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.orderBy(builder.desc(root.get(sortBy)));

        return session.createQuery(query)
                .setFirstResult((page - 1) * size)
                .setMaxResults(size)
                .getResultList();
    }

    public StudyGroup updateStudyGroup(StudyGroup entity) {
        Session session = sessionFactory.getCurrentSession();
        return session.merge(entity);
    }

    public void deleteStudyGroupById(int id) {
        Session session = sessionFactory.getCurrentSession();
        StudyGroup entity = session.find(StudyGroup.class, id);
        if (entity != null) {
            session.remove(entity);
        }
    }

    public void deleteAll() {
        Session session = sessionFactory.getCurrentSession();
        session.createNativeMutationQuery("truncate table studygroup").executeUpdate();
    }

    public List<StudyGroup> getAll() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = builder.createQuery(StudyGroup.class);

        return session.createQuery(query)
                .getResultList();
    }

    public Long countExpelledStudents() {
        CriteriaBuilder cb = sessionFactory.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);

        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.select(cb.sum(root.get("expelledStudents")));

        return sessionFactory.getCurrentSession().createQuery(query).getSingleResult();
    }

    public List<StudyGroup> searchByNamePrefix(String prefix) {
        CriteriaBuilder cb = sessionFactory.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = cb.createQuery(StudyGroup.class);

        Root<StudyGroup> root = query.from(StudyGroup.class);
        Predicate nameStartsWith = cb.like(root.get("name"), prefix + "%");
        query.select(root).where(nameStartsWith);

        return sessionFactory.getCurrentSession().createQuery(query).getResultList();
    }

    public List<Object[]> getGroupCountById() {
        CriteriaBuilder cb = sessionFactory.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);
        Root<StudyGroup> root = query.from(StudyGroup.class);

        query.multiselect(root.get("id"), cb.count(root))
                .groupBy(root.get("id"));

        return sessionFactory.getCurrentSession().createQuery(query).getResultList();
    }

    public void deleteByShouldBeExpelled(Integer value) {
        CriteriaBuilder cb = sessionFactory.getCriteriaBuilder();
        CriteriaDelete<StudyGroup> delete = cb.createCriteriaDelete(StudyGroup.class);
        Root<StudyGroup> root = delete.from(StudyGroup.class);

        delete.where(cb.equal(root.get("shouldBeExpelled"), value));

        sessionFactory.getCurrentSession().createMutationQuery(delete).executeUpdate();
    }
}
