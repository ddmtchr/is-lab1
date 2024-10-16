package com.brigada.backend.service;

import com.brigada.backend.domain.StudyGroup;
import com.brigada.backend.security.entity.Role;
import com.brigada.backend.security.entity.User;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {
    public boolean canEditOrDelete(User currentUser, StudyGroup studyGroup) {
        if (studyGroup.getCreatedBy().equals(currentUser)) {
            return true;
        }
        return currentUser.getRoles().contains(Role.ADMIN) && studyGroup.isEditableByAdmin();
    }
}
