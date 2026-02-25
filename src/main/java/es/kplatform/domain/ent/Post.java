package es.kplatform.domain.ent;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 280, nullable = false)
    private String content;

    @OneToMany(mappedBy = "post")
    @JsonManagedReference
    private List<Comment> comments;

    // Getters e Setters
    @JsonProperty("userId") // Serializza l'ID dell'utente
    public Integer getUserId() {
        return user != null ? user.getUserId() : null;
    }

    @JsonProperty("comments") // Serializza la lista dei commenti
    public List<Comment> getComments() {
        return comments;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setComments(List<Comment> comment) {
        this.comments = comment;
    }
}

