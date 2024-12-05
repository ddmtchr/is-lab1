package com.brigada.backend.dao;

import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.security.entity.User;
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
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = builder.createQuery(StudyGroup.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.select(root).where(builder.equal(root.get("id"), id));

        List<StudyGroup> list = session.createQuery(query).getResultList();
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public Optional<StudyGroup> getStudyGroupByIdAndUser(Integer id, User user) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = builder.createQuery(StudyGroup.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.select(root).where(builder.equal(root.get("id"), id),
                builder.equal(root.get("createdBy").get("id"), user.getId()));

        List<StudyGroup> list = session.createQuery(query).getResultList();
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
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

    public List<StudyGroup> getAllStudyGroups(String sortBy) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = builder.createQuery(StudyGroup.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.orderBy(builder.desc(root.get(sortBy)));

        return session.createQuery(query).getResultList();
    }

    public boolean existsByName(String name) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.select(builder.count(root)).where(builder.equal(root.get("name"), name));
        Long count = session.createQuery(query).getSingleResult();
        return count > 0;
    }

    public StudyGroup updateStudyGroup(StudyGroup entity) {
        Session session = sessionFactory.getCurrentSession();
        return session.merge(entity);
    }

    public void deleteStudyGroup(StudyGroup entity) {
        Session session = sessionFactory.getCurrentSession();
        session.remove(entity);
    }

    public void deleteStudyGroupById(int id) {
        Session session = sessionFactory.getCurrentSession();
        StudyGroup entity = session.find(StudyGroup.class, id);
        if (entity != null) {
            session.remove(entity);
        }
    }

    public void deleteAll() { // wtf doesnt work
        Session session = sessionFactory.getCurrentSession();
        session.createNativeMutationQuery("truncate table studygroup").executeUpdate();
    }

    public List<StudyGroup> getAll() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<StudyGroup> query = builder.createQuery(StudyGroup.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);
        query.select(root);

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

    public List<StudyGroup> findByShouldBeExpelled(Integer value, User user) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = sessionFactory.getCriteriaBuilder();

        CriteriaQuery<StudyGroup> selectQuery = builder.createQuery(StudyGroup.class);
        Root<StudyGroup> root = selectQuery.from(StudyGroup.class);
        selectQuery.select(root)
                .where(builder.equal(root.get("shouldBeExpelled"), value),
                        builder.equal(root.get("createdBy").get("id"), user.getId()));

        return session.createQuery(selectQuery).getResultList();
    }

    public List<Integer> deleteByShouldBeExpelled(Integer value, User user) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = sessionFactory.getCriteriaBuilder();

        CriteriaQuery<Integer> selectQuery = builder.createQuery(Integer.class);
        Root<StudyGroup> root = selectQuery.from(StudyGroup.class);
        selectQuery.select(root.get("id"))
                .where(builder.equal(root.get("shouldBeExpelled"), value),
                        builder.equal(root.get("createdBy").get("id"), user.getId()));

        List<Integer> deletedGroupIds = session.createQuery(selectQuery).getResultList();

        CriteriaDelete<StudyGroup> delete = builder.createCriteriaDelete(StudyGroup.class);
        Root<StudyGroup> deleteRoot = delete.from(StudyGroup.class);
        delete.where(builder.equal(deleteRoot.get("shouldBeExpelled"), value),
                builder.equal(deleteRoot.get("createdBy").get("id"), user.getId()));

        session.createMutationQuery(delete).executeUpdate();

        return deletedGroupIds;
    }

    public long countGroupsByCoordinatesId(Long coordinatesId, User user) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);

        query.select(builder.count(root))
                .where(builder.equal(root.get("coordinates").get("id"), coordinatesId),
                        builder.equal(root.get("createdBy").get("id"), user.getId()));

        return session.createQuery(query).getSingleResult();
    }

    public long countGroupsByAdminId(Long adminId, User user) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<StudyGroup> root = query.from(StudyGroup.class);

        query.select(builder.count(root))
                .where(builder.equal(root.get("groupAdmin").get("id"), adminId),
                        builder.equal(root.get("createdBy").get("id"), user.getId()));

        return session.createQuery(query).getSingleResult();
    }
}
