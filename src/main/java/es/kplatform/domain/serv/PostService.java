package es.kplatform.domain.serv;

import es.kplatform.domain.repo.*;
import es.kplatform.domain.ent.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postsRepository;

    public Iterable<Post> getAllPosts() {
        return postsRepository.findAll();
    }

    public Post getPostById(Integer postId) {
        return postsRepository.findById(postId).orElse(null);
    }

    public Post createPost(Post post) {
        return postsRepository.save(post);
    }

    public void deletePost(Integer postId) {
        postsRepository.deleteById(postId);
    }

    //Fornisco 5 post casuali. Se ne ho meno di 5 in totale li fornisco tutti
    /*public Iterable<Post> getTenCasualPosts() {
//        List<Post> allPosts = new ArrayList<>(postsRepository.findAll());
//
//        if (allPosts.size() <= 10) {
//            return allPosts;
//        }
//
//        Collections.shuffle(allPosts); // Mescola l'elenco
//        return allPosts.subList(0, 10);
    }*/

    public Iterable<Post> getLast10Posts(int lastId) {
        if (lastId == 0) {
            return postsRepository.findTop10ByOrderByPostIdDesc();
        }
        return postsRepository.findTop10ByPostIdLessThanOrderByPostIdDesc(lastId);
    }

    public Iterable<Post> getLast5Posts(int lastId) {
        if (lastId == 0) {
            return postsRepository.findTop5ByOrderByPostIdDesc();
        }
        return postsRepository.findTop5ByPostIdLessThanOrderByPostIdDesc(lastId);
    }

}
