package com.brigada.backend.service;

import com.brigada.backend.dao.TestDAO;
import com.brigada.backend.domain.TestEntity;
import com.brigada.backend.dto.response.TestEntityResponseDTO;
import com.brigada.backend.mapper.TestMapper;
import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {
    private final TestDAO testDAO;

    private final UserDAO userDAO;

    public List<TestEntityResponseDTO> get() {
        return testDAO.get().stream().map(TestMapper.INSTANCE::toResponseDTO).collect(Collectors.toList());
    }

    public void save(TestEntity e, String username) {
        System.out.println("In service");
        Optional<User> optional = userDAO.findByUsername(username);
        if (optional.isEmpty()) throw new RuntimeException("User not found");

        User user = optional.get();
        e.setCreator(user);

        testDAO.save(e);
    }
}
