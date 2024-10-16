package com.brigada.backend.security.service;


import com.brigada.backend.dto.response.AdminApplicationResponseDTO;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.AdminApplicationMapper;
import com.brigada.backend.mapper.UserMapper;
import com.brigada.backend.security.dao.AdminApplicationDAO;
import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.AdminApplication;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminApplicationService {
    private final AdminApplicationDAO dao;
    private final UserDAO userDAO;

    public List<AdminApplicationResponseDTO> getAllApplications() {
        return dao.getAllApplications()
                .stream()
                .map(AdminApplicationMapper.INSTANCE::toAdminApplicationResponseDTO)
                .collect(Collectors.toList());
    }

    public void approveApplication(Long id) {
        AdminApplication application = dao.getApplicationById(id)
                .orElseThrow(() -> new NotFoundException("Application doesn't exist"));
        userDAO.addUser(UserMapper.INSTANCE.toUser(application));
        dao.deleteApplication(application);
    }

    public void rejectApplication(Long id) {
        AdminApplication application = dao.getApplicationById(id)
                .orElseThrow(() -> new NotFoundException("Application doesn't exist"));
        dao.deleteApplication(application);
    }
}
