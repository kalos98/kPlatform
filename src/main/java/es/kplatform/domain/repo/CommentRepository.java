package es.kplatform.domain.repo;

import es.kplatform.domain.ent.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
}
