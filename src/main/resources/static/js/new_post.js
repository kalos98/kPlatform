function createPost() {
    const postContent = $('#content').val();
    if (postContent.length > 280) {
        $('#content').addClass('error');
        $('#content').attr('title', 'Il post non può superare i 280 caratteri.');
        return;
    }
    if (postContent.length < 1) {
        $('#content').addClass('error');
        $('#content').attr('title', 'Il post non può essere vuoto.');
        return;
    }
    $('#content').removeClass('error');
    $('#content').removeAttr('title');

    const postData = {

        content: postContent,
        user: {
            username: $('.new_post-header .username').text()
        }
    }

    fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella risposta del server.');
            }
            return response.json();
        })
        .then(newPost => {
            $('#content').val('');
            $("#modal").css("display", "none");

            //Chiamo structurize per aggiungere il post appena creato
            structurize(
                newPost.user.username,
                newPost.content,
                [], // Array di commenti vuoto
                'Adesso', // Appena postato
                newPost.postId,
                0, // Nessun Commento
                true // Post da inserire in top

            );
        })
        .catch(error => {
            alert('Si è verificato un errore.');
            console.error('Error:', error);
        });
}