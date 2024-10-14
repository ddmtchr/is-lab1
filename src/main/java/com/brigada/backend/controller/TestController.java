package com.brigada.backend.controller;

import com.brigada.backend.domain.TestEntity;
import com.brigada.backend.security.jwt.JwtUtils;
import com.brigada.backend.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {
    private final TestService service;

    private final JwtUtils jwtUtils;

    @GetMapping("/test")
    public ResponseEntity<?> get() {
        System.out.println("In controller");
        return ResponseEntity.ok(service.get());
    }

    @PostMapping("/test")
    public ResponseEntity<?> post(@RequestBody TestEntity e) {
        System.out.println("In controller");
        String username = jwtUtils.getCurrentUser().getUsername();

        service.save(e, username);
        return ResponseEntity.ok().build();
    }
}
