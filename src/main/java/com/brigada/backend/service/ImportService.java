package com.brigada.backend.service;

import com.brigada.backend.dao.ImportHistoryDAO;
import com.brigada.backend.dto.response.ImportHistoryResponseDTO;
import com.brigada.backend.mapper.ImportHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportService {
    private final ImportHistoryDAO importHistoryDAO;

    public List<ImportHistoryResponseDTO> getAllImportHistory() {
        return importHistoryDAO.getAllImportHistory().stream().map(ImportHistoryMapper.INSTANCE::toResponseDTO).toList();
    }

    public List<ImportHistoryResponseDTO> getUsersImportHistory(String username) {
        return importHistoryDAO.getUsersImportHistory(username).stream().map(ImportHistoryMapper.INSTANCE::toResponseDTO).toList();
    }


}
