package com.brigada.backend.service;

import com.brigada.backend.dao.ImportHistoryDAO;
import com.brigada.backend.domain.ImportHistory;
import com.brigada.backend.domain.ImportStatus;
import com.brigada.backend.dto.request.StudyGroupRequestDTO;
import com.brigada.backend.dto.response.ImportHistoryResponseDTO;
import com.brigada.backend.exception.ImportException;
import com.brigada.backend.exception.NotFoundException;
import com.brigada.backend.mapper.ImportHistoryMapper;
import com.brigada.backend.security.dao.UserDAO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImportService {
    private final ObjectMapper objectMapper;
    private final ImportHistoryDAO importHistoryDAO;
    private final StudyGroupService studyGroupService;
    private final UserDAO userDAO;
    private final MinioService minioService;

    public List<ImportHistoryResponseDTO> getAllImportHistory() {
        return importHistoryDAO.getAllImportHistory().stream().map(ImportHistoryMapper.INSTANCE::toResponseDTO).toList();
    }

    public List<ImportHistoryResponseDTO> getUsersImportHistory(String username) {
        return importHistoryDAO.getUsersImportHistory(username).stream().map(ImportHistoryMapper.INSTANCE::toResponseDTO).toList();
    }

    @Transactional
    public Long importStudyGroups(MultipartFile file, String username) {
        List<StudyGroupRequestDTO> studyGroups;
        ImportHistory history = new ImportHistory();
        history.setUser(userDAO.findByUsername(username).orElseThrow(() -> new NotFoundException("User not found")));

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename() ;

        try {
            studyGroups = objectMapper.readValue(file.getInputStream(), new TypeReference<List<StudyGroupRequestDTO>>() {
            });
        } catch (IOException e) {
            history.setStatus(ImportStatus.FAILED);
            importHistoryDAO.addImportHistory(history);
            throw new ImportException("Error parsing the file", e);
        }


        try {
            for (StudyGroupRequestDTO sg : studyGroups) {
                studyGroupService.createStudyGroup(sg, username);
            }
            long importedCount = studyGroups.size();

            minioService.uploadFileToMinIO(file, fileName);

            history.setStatus(ImportStatus.SUCCESS);
            history.setObjectsCount(importedCount);
            history.setFileName(fileName);
            importHistoryDAO.addImportHistory(history);

            return importedCount;
        } catch (Exception e) {
            history.setStatus(ImportStatus.FAILED);
            importHistoryDAO.addImportHistory(history);

            minioService.deleteFileFromMinIO(fileName);

            throw new ImportException("Import failed: " + e.getMessage());
        }
    }

}
