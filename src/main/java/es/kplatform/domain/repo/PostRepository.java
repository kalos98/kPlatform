package es.kplatform.domain.repo;

import es.kplatform.domain.ent.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

public interface PostRepository extends CrudRepository<Post, Integer> {
    Collection<Post> findAll();

    List<Post> findAll(Sort sort);

    List<Post> findTop10ByOrderByPostIdDesc();

    List<Post> findTop10ByPostIdLessThanOrderByPostIdDesc(int lastId);

    List<Post> findTop5ByOrderByPostIdDesc();

    List<Post> findTop5ByPostIdLessThanOrderByPostIdDesc(int lastId);



}
