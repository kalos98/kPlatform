package es.kplatform.domain.serv;

import es.kplatform.domain.repo.*;
import es.kplatform.domain.ent.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentsRepository;

    public List<Comment> getAllComments() {
        return commentsRepository.findAll();
    }

    public Comment getCommentById(Integer commentId) {
        return commentsRepository.findById(commentId).orElse(null);
    }

    public Comment createComment(Comment comment) {
        return commentsRepository.save(comment);
    }

    public void deleteComment(Integer commentId) {
        commentsRepository.deleteById(commentId);
    }

}
