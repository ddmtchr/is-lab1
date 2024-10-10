package com.brigada.backend.security.service;

import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserDAO userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found"));
    }

    public boolean existsByUsername(String username) {
        return userDao.existsByUsername(username);
    }

    public void addUser(User user) {
        userDao.addUser(user);
    }
}
