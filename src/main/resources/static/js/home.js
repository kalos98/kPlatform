let lastId = 0;
let isLoad = false;
let postsFinished = false;

//Richiesta XML all'end-point
function loadXML() {
    if (!isLoad && !postsFinished) {
        fetch(`/home?lastId=${lastId}`, {  //``racchiudere un espressione js tra i backtick mi permette di interpretare le variabili come tali
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            isLoad = true;
            return response.text();
        }).then((xmlString) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");
            loadXMLPosts(xmlDoc);
        }).catch((error) => {
            console.error("Errore durante il caricamento:", error);
        });
    }
}

//Questa funzione in precenza chiamava un secondo file xml, ora resetta delle varibili e chiama la funzione loadXML
function loadOtherXML(){
    if (postsFinished) {
        alert("Non ci sono più post da caricare.");
        return;
    }
    isLoad = false;
    loadXML();
}

//Spacchettamento features dal file XML
function loadXMLPosts(xmlresponse) {
    posts = xmlresponse.documentElement.getElementsByTagName("post");
    if (posts.length === 0) {
        postsFinished = true;
        alert("Non ci sono post da caricare.");
        return;
    }

    // Aggiorno il valore di lastId con l'ID più alto tra i post caricati
    for (let i = 0; i < posts.length; i++) {
        let id = parseInt(posts[i].getElementsByTagName("postId")[0].firstChild.nodeValue);
        if (i === (posts.length - 1) ) {
            lastId = id; // Aggiorna al più basso (ultimo nella lista corrente)
        }
    }

    for (let i = 0; i < posts.length; i++) {
        let author = posts[i].getElementsByTagName("username")[0].firstChild.nodeValue;
        let message = posts[i].getElementsByTagName("content")[0].firstChild.nodeValue;
        let dateTime = posts[i].getElementsByTagName("createdAt")[0].firstChild.nodeValue;
        let comments = posts[i].getElementsByTagName("comments")[0].childNodes;
        let id = posts[i].getElementsByTagName("postId")[0].firstChild.nodeValue;
        let commentCount = posts[i].getElementsByTagName("commentCount")[0].textContent;

        let timeAgo = getTimeAgo(dateTime);

        structurize(author, message, comments, timeAgo, id, commentCount);
    }
}

//Creazione dinamica struttura post
function structurize(author, message, comments, dateTime, id, commentCount, insertAtTop = false) {

    //Divisore
    const hr = document.createElement("hr");

    //Box principale
    mainBox = document.getElementById("main-box");

    //Struttura HTML post
    let postBox = document.createElement("div");
    postBox.className = "post-box";
    postBox.id = id;
    postBox.onclick = function(){
        modalPostWindow(this.id);
    };

    let postHeader = document.createElement("div");
    postHeader.className = "post-header";

    let img = document.createElement("img");
    img.src = "/profile/profile_photo.jpg";

    let usernameDiv = document.createElement("div");
    usernameDiv.className = "username";
    usernameDiv.textContent = author;

    let dateTimeDiv = document.createElement("div");
    dateTimeDiv.className = "dateTime";
    dateTimeDiv.textContent = dateTime;

    postHeader.appendChild(img);
    postHeader.appendChild(usernameDiv);
    postHeader.appendChild(dateTimeDiv);

    let postContent = document.createElement("div");
    postContent.className = "post-content";
    postContent.textContent = message;

    //Struttura HTML commenti (display=none)
    let postComments = document.createElement("div");
    postComments.className = "post-comments";
    postComments.style.display ="none";

    //Divisore commenti
    const commentsHr = document.createElement("hr");
    postComments.appendChild(commentsHr);

    for(let i=0; i<comments.length; i++){
        if(comments[i].nodeType === 1){   //Verifico che il nodo sia un elemento, perché se becca il nodo vuoto si impanica
            let comment = document.createElement("div");
            comment.className = "comment-box";

            let headerDiv = document.createElement("div");
            headerDiv.className = "comment-header";

            let img = document.createElement("img");
            img.src = "/profile/profile_photo.jpg";

            let usernameDiv = document.createElement("div");
            usernameDiv.className = "username";
            usernameDiv.textContent = comments[i].getElementsByTagName("username")[0].textContent;

            //Calcolo tempo trascorso
            let timeAgo = getTimeAgo(comments[i].getElementsByTagName("createdAt")[0].textContent);

            let dateTimeDiv = document.createElement("div");
            dateTimeDiv.className = "dateTime";
            dateTimeDiv.textContent = timeAgo;

            headerDiv.appendChild(img);
            headerDiv.appendChild(usernameDiv);
            headerDiv.appendChild(dateTimeDiv)

            let bodyDiv = document.createElement("div");
            bodyDiv.className = "comment-body";

            let message = document.createElement("div");
            message.className = "message";
            message.textContent = comments[i].getElementsByTagName("content")[0].firstChild.nodeValue;
            bodyDiv.appendChild(message);

            comment.appendChild(headerDiv);
            comment.appendChild(bodyDiv);
            postComments.appendChild(comment);
        }
    }

    // Nuova features tasto commenti
    const commentIcon = document.createElement("div");
    commentIcon.className = "comment-icon";
    commentIcon.innerHTML = `<img src="/png/comment.png" alt="Comment Icon"> ${commentCount}`;

    postBox.appendChild(postHeader);
    postBox.appendChild(postContent);
    postBox.appendChild(commentIcon); // Nuova features tasto commenti
    postBox.appendChild(postComments);

    // Inserisco il post appena creato nel DOM

    if (mainBox.children.length > 0) {
        mainBox.appendChild(hr);
    }
    mainBox.appendChild(postBox);
}

//Creazione finestra modale post esploso
function modalPostWindow(id) {
    modalContent = document.getElementById("modal-content");

    // Pulisco la finestra
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    //Clono il post
    postContent = document.getElementById(id).cloneNode(true);

    //Aggiungo la classe per modificare il comportamento hover
    postContent.classList.add("modal-hover");

    //Rimuovo il contatore commenti
    postContent.getElementsByClassName("comment-icon")[0].remove();

    //Attivo la visualizzazione dei commenti
    comments = postContent.getElementsByClassName("post-comments")[0];
    comments.style.display = "flex";

    //Aggiungo la sezione input commenti

    let add_comment_box = document.createElement("div");
    add_comment_box.className = "add_comment-box";

    let add_comment_header = document.createElement("div");
    add_comment_header.className = "add_comment-header";

    let img_add_comment = document.createElement("img");
    img_add_comment.src = "/profile/profile_photo.jpg";
    add_comment_header.appendChild(img_add_comment);

    add_comment_box.appendChild(add_comment_header);

    let add_comment_content = document.createElement("div");
    add_comment_content.className = "add_comment-content";

    let add_comment_content_input = document.createElement("input");
    add_comment_content_input.id = "add_comment_content_input";
    add_comment_content_input.type = "text";
    add_comment_content_input.placeholder = "Aggiungi un commento...";
    add_comment_content.appendChild(add_comment_content_input);

    add_comment_box.appendChild(add_comment_content);

    let add_comment_button = document.createElement("button");
    add_comment_button.id = "add_comment_button";
    add_comment_button.className = "add_comment-button";
    add_comment_button.textContent = "Invia";
    add_comment_box.appendChild(add_comment_button);

    // Trova l'elemento <hr> dopo il quale inserire la sezione per aggiungere il commento
    let hrElements = postContent.getElementsByTagName("hr");
    if (hrElements.length > 0) {
        hrElements[0].insertAdjacentElement("afterend", add_comment_box);
    } else {
        // Se non esiste un <hr>, aggiungo la sezione alla fine
        postContent.appendChild(add_comment_box);
    }

    //Aggiungo un divsore di chisura
    let hr = document.createElement("hr");
    add_comment_box.insertAdjacentElement("afterend", hr);

    //Aggiungo il contenuto alla finestra e visualizzo la finestra
    modalContent.appendChild(postContent);
    document.getElementById("modal").style.display = "flex"

    //Aggiungo il listner per far si che il tasto invochi la funzione
    $("#add_comment_button").on("click", createComment);
}

//Chiusura finestra modale
function modalPostWindowClose(){
    document.getElementById("modal").style.display = "none";
    document.getElementById("modal-content").innerHTML = '';
}

//Listener sulla posizione dei click che chiama la funzione di chiusura della finestra modale
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        modalPostWindowClose();
    }
}

//Listener che mi permette di capire quando sono a fine pagine e di caricare altro xml
window.addEventListener('scroll', function(){
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight)) {
        loadOtherXML()
    }
})

//Modale per aggiungere Post
$(document).ready(function(){
    $("#newPost_button").on("click", function() {
        $("#modal-content").load("new_post.html", function (){
            //Ottengo l'username di chi sta postando
            fetch('/current-username')
                .then(response => response.text())
                .then(username => {
                    $('.new_post-header .username').text(username);
                })
                .catch(error => {
                    console.error('Error fetching username:', error);
                });
            $("#modal").css("display", "flex");
        })
    })
})

//Calcolatore di tempo trascorso
function getTimeAgo(dateTimeString) {
    let postDate = new Date(dateTimeString);
    let now = new Date();
    let timeDiff = Math.abs(now - postDate);

    let seconds = Math.floor(timeDiff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    let timeAgo = '';
    if (days > 0) {
        timeAgo = days === 1 ? '1 giorno fa' : `${days} giorni fa`;
    } else if (hours > 0) {
        timeAgo = hours === 1 ? '1 ora fa' : `${hours} ore fa`;
    } else if (minutes > 0) {
        timeAgo = minutes === 1 ? '1 minuto fa' : `${minutes} minuti fa`;
    } else {
        timeAgo = 'Pochi secondi fa';
    }
    return timeAgo;
}
