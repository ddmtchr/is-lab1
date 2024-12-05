package com.brigada.backend.security.service;

import com.brigada.backend.security.dao.AdminApplicationDAO;
import com.brigada.backend.security.dao.UserDAO;
import com.brigada.backend.security.entity.Role;
import com.brigada.backend.security.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
    private final UserDAO userDao;
    private final AdminApplicationDAO adminApplicationDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found"));
    }

    public boolean existsByUsername(String username) {
        return userDao.existsByUsername(username);
    }

    public boolean addUser(User user) {
//        if (user.getRoles().contains(Role.ADMIN) && userDao.countAdmins() > 0) {
//            adminApplicationDAO.addApplication(user);
//            return false;
//        } else {
            userDao.addUser(user);
            return true;
//        }
    }
}
