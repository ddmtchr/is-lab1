package com.brigada.backend.controller;

import com.brigada.backend.domain.TestEntity;
import com.brigada.backend.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @Autowired
    private TestService service;

    @PostMapping("/test")
    public ResponseEntity<?> get(@RequestBody TestEntity e) {
        System.out.println("In controller");
        service.save(e);
        return ResponseEntity.ok().build();
    }
}
