package com.brigada.backend.service;

import com.brigada.backend.dao.TestDAO;
import com.brigada.backend.domain.TestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {
    @Autowired
    private TestDAO testDAO;

    public void save(TestEntity e) {
        System.out.println("In service");
        testDAO.save(e);
    }
}
