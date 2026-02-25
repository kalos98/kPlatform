package es.kplatform.web;

import es.kplatform.domain.ent.*;
import es.kplatform.domain.serv.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Controller
public class PlatformDBController {
    @Autowired
    private UserService userService;
    @Autowired
    private PostService postService;
    @Autowired
    private CommentService commentService;

    final TemplateEngine templateEngine;

    public PlatformDBController(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @GetMapping("/")
    public String redirectToHome() {
        return "redirect:/home.html";
    }

    //uri per aggiungere post al database
    @PostMapping("/post")
    public @ResponseBody Post createPost(@RequestBody Post post) {
        try{
            User user = userService.getUserByName(post.getUser().getUsername());
            post.setUser(user);
            post.setCreatedAt(LocalDateTime.now());
            return postService.createPost(post);
        }catch (Exception e){
            throw new RuntimeException("Errore creazione post", e);
        }
    }

    //Uri per aggiungere commenti al database
    @PostMapping("/comment")
    public @ResponseBody Comment createComment(@RequestBody Comment comment) {
        try{
            Post post = postService.getPostById(comment.getPost().getPostId());
            User user = userService.getUserByName(comment.getUser().getUsername());
            comment.setUser(user);
            comment.setPost(post);
            comment.setCreatedAt(LocalDateTime.now());

            return commentService.createComment(comment);
        }catch (Exception e){
            throw new RuntimeException("Errore creazione commento", e);
        }
    }

    @GetMapping(value ="/home", produces = MediaType.APPLICATION_XML_VALUE)
    public @ResponseBody String getPosts(Model model, @RequestParam int lastId) {
        try{
            model.addAttribute("posts", postService.getLast5Posts(lastId));
            Context context = new Context();
            context.setVariables(model.asMap());
            return templateEngine.process("posts", context);
        }catch (Exception e){
            throw new RuntimeException("Errore fetch posts", e);
        }
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") User user, Model model) {
        if (userService.existByUsername(user.getUsername())) {
            model.addAttribute("errore", "L'utente con username " + user.getUsername() + " esiste già");
            return "register";
        }
        userService.createUser(user);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "error", required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("errore", "Username o password errati. Riprova.");
        }
        return "login";
    }

    @GetMapping("/profile")
    public String showUserProfile(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.getUserByName(userDetails.getUsername());
            model.addAttribute("user", user);
        }
        return "profile";
    }

    @GetMapping("/current-username")
    public @ResponseBody String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername();
        }
        return "Anonymous";
    }

}


