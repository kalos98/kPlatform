package es.kplatform.domain.serv;

import es.kplatform.domain.repo.*;
import es.kplatform.domain.ent.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public boolean existByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setEnabled(true);
        user.setRole("ROLE_USER");
        return usersRepository.save(user);
    }

    public void deleteUser(Integer userId) {
        usersRepository.deleteById(userId);
    }

    public User getUserById(Integer userId) {
        return usersRepository.findById(userId).orElse(null); //Il metodo di crud restituisce Optional che deve essere gestito
    }

    public User getUserByName(String username) {
        return usersRepository.findByUsername(username);
    }

}
