package es.kplatform.domain.repo;

import es.kplatform.domain.ent.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Integer> {
    public List<User> findAll();

    public boolean existsByUsername(String username);

    public User findByUsername(String username);

}

