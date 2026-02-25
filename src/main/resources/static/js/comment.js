//Funzione creazione commento
function createComment() {

    const commentContent = $('#add_comment_content_input').val();
    if (commentContent.length > 160) {
        $('#add_comment_content_input').addClass('error');
        $('#add_comment_content_input').attr('title', 'Il commento non può superare i 160 caratteri.');
        return;
    }
    if (commentContent.length < 1) {
        $('#add_comment_content_input').addClass('error');
        $('#add_comment_content_input').attr('title', 'Il commento non può essere vuoto.');
        return;
    }
    $('#add_comment_content_input').removeClass('error');
    $('#add_comment_content_input').removeAttr('title');

    // Ottengo il contenuto dal campo di input
    const idValue = $('#modal-content .post-box').attr('id');

    fetch('/current-username')
        .then(response => response.text())
        .then(username => {
            const commentData = {
                content: commentContent,
                post: {
                    postId: idValue,

                },
                user: {
                    username: username
                }
            }

            fetch('/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nella risposta del server.');
                    }
                    return response.json();
                })
                .then(newComment => {
                    $('#add_comment_content_input').val(''); //Pulisco input
                    updateCommentCount(idValue); //Funzione per aggiornare il contatore dei commenti
                    addCommentToDOM(newComment); //Funzione per nuovo commento a DOM
                    addCommentToOriginalPost(newComment, idValue); // Aggiungo il commento al post originale
                })
                .catch(error => {
                    alert('Si è verificato un errore durante l\'invio del commento.');
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching username:', error);
        });
}

//Aggiungo il nuovo commento alla modale dopo averlo creato
function addCommentToDOM(comment) {
    // Trova la sezione dei commenti nel DOM
    let postComments = document.querySelector("#modal-content .post-comments");

    let commentBox = document.createElement("div");
    commentBox.className = "comment-box";

    let headerDiv = document.createElement("div");
    headerDiv.className = "comment-header";

    let img = document.createElement("img");
    img.src = "/profile/profile_photo.jpg";

    let usernameDiv = document.createElement("div");
    usernameDiv.className = "username";
    usernameDiv.textContent = comment.user.username;

    // tempo trascorso
    let timeAgo = "Adesso";

    let dateTimeDiv = document.createElement("div");
    dateTimeDiv.className = "dateTime";
    dateTimeDiv.textContent = timeAgo;

    headerDiv.appendChild(img);
    headerDiv.appendChild(usernameDiv);
    headerDiv.appendChild(dateTimeDiv);

    let bodyDiv = document.createElement("div");
    bodyDiv.className = "comment-body";

    let message = document.createElement("div");
    message.className = "message";
    message.textContent = comment.content;

    bodyDiv.appendChild(message);

    commentBox.appendChild(headerDiv);
    commentBox.appendChild(bodyDiv);

    //Inserisco il commento alla fiene
    postComments.appendChild(commentBox);
}

//Aggiorno il contatore dei commenti nel post a seguito di un nuovo commento
function updateCommentCount(postId) {
    const postBox = document.getElementById(postId);

    if (postBox) {
        const commentIcon = postBox.querySelector(".comment-icon");
        if (commentIcon) {
            // Estrai il conteggio attuale
            let count = parseInt(commentIcon.textContent.trim()) || 0;
            count += 1;
            commentIcon.innerHTML = `<img src="/png/comment.png" alt="Comment Icon"> ${count}`;
        }
    }
}

//Aggiungo il commento al post originale
function addCommentToOriginalPost(comment, postId) {
    // Trova il post originale nel DOM
    const postBox = document.getElementById(postId);
    if (postBox) {
        // Trova la sezione dei commenti
        let postComments = postBox.getElementsByClassName("post-comments")[0];
        if (postComments) {

            // Crea il commento
            let commentBox = document.createElement("div");
            commentBox.className = "comment-box";

            let headerDiv = document.createElement("div");
            headerDiv.className = "comment-header";

            let img = document.createElement("img");
            img.src = "/profile/profile_photo.jpg";

            let usernameDiv = document.createElement("div");
            usernameDiv.className = "username";
            usernameDiv.textContent = comment.user.username;

            // tempo trascorso
            let timeAgo = "Adesso";

            let dateTimeDiv = document.createElement("div");
            dateTimeDiv.className = "dateTime";
            dateTimeDiv.textContent = timeAgo;

            headerDiv.appendChild(img);
            headerDiv.appendChild(usernameDiv);
            headerDiv.appendChild(dateTimeDiv);

            let bodyDiv = document.createElement("div");
            bodyDiv.className = "comment-body";

            let message = document.createElement("div");
            message.className = "message";
            message.textContent = comment.content;

            bodyDiv.appendChild(message);

            commentBox.appendChild(headerDiv);
            commentBox.appendChild(bodyDiv);

            // Aggiunge il commento alla fine della sezione dei commenti
            postComments.appendChild(commentBox);
        }
    }
}