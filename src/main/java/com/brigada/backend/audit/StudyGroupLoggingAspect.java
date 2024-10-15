package com.brigada.backend.audit;

import com.brigada.backend.audit.dao.StudyGroupLogDAO;
import com.brigada.backend.audit.entity.ActionType;
import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.audit.entity.StudyGroupLog;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.User;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.Optional;

@Aspect
@Component
@RequiredArgsConstructor
public class StudyGroupLoggingAspect {
    private final StudyGroupLogDAO logDAO;
    private final UserDAO userDAO;

    @Pointcut("execution(* com.brigada.backend.dao.StudyGroupDAO.createStudyGroup(..))")
    private void createMethod() {
    }

    @Pointcut("execution(* com.brigada.backend.dao.StudyGroupDAO.updateStudyGroup(..))")
    private void updateMethod() {
    }

    @AfterReturning(pointcut = "createMethod()", returning = "createdGroup")
    public void logCreateStudyGroup(JoinPoint joinPoint, StudyGroup createdGroup) {
        Object[] args = joinPoint.getArgs();
        User user = ((StudyGroup) args[0]).getCreatedBy();

        logAction(ActionType.CREATE, user, createdGroup);
    }

    @AfterReturning(pointcut = "updateMethod()", returning = "updatedGroup")
    public void logUpdateStudyGroup(JoinPoint joinPoint, StudyGroup updatedGroup) {
        Object[] args = joinPoint.getArgs();
        User user = ((StudyGroup) args[0]).getCreatedBy();

        logAction(ActionType.UPDATE, user, updatedGroup);
    }

    @Before("execution(* com.brigada.backend.dao.StudyGroupDAO.deleteStudyGroup(..))")
    public void logDeleteStudyGroup(JoinPoint joinPoint) {
        StudyGroup entity = (StudyGroup) joinPoint.getArgs()[0];

        logAction(ActionType.DELETE, entity.getCreatedBy(), entity);
    }

    private void logAction(ActionType action, String username, StudyGroup studyGroup) {
        Optional<User> userOptional = userDAO.findByUsername(username);
        if (userOptional.isPresent()) {
            StudyGroupLog log = new StudyGroupLog();
            log.setAction(action);
            log.setUser(userOptional.get());
            log.setStudyGroupId(studyGroup.getId());
            log.setActionTime(ZonedDateTime.now());
            logDAO.createLog(log);
        }
    }

    private void logAction(ActionType action, User user, StudyGroup studyGroup) {
        StudyGroupLog log = new StudyGroupLog();
        log.setAction(action);
        log.setUser(user);
        log.setStudyGroupId(studyGroup.getId());
        log.setActionTime(ZonedDateTime.now());
        logDAO.createLog(log);

    }
}
