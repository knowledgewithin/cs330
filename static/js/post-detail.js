
let activePost;
let activeComments;

// gets post from the server:
const getPost = () => {
    // get post id from url address:
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);

    // fetch post:
    fetch('/api/posts/' + id + '/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            activePost = data;
            renderPost();
        });
};

// gets the comments associated with the post
const getComments = () => {
    // fetch comments:
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);
    fetch('/api/posts/' + id + '/comments/')
        .then(response => response.json())
        .then(data => {
            activeComments = data;
            console.log(data);
            renderComments();
        });
};

// updates the post:
const updatePost = (ev) => {
    const data = {
        title: document.querySelector('#title').value,
        content: document.querySelector('#content').value,
        author: document.querySelector('#author').value
    };
    console.log(data);
    fetch('/api/posts/' + activePost.id + '/', { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            activePost = data;
            renderPost();
            showConfirmation();
        });
    
    // this line overrides the default form functionality:
    ev.preventDefault();
};


const deletePost = (ev) => {
    const doIt = confirm('Are you sure you want to delete this blog post?');
    if (!doIt) {
        return;
    }
    fetch('/api/posts/' + activePost.id + '/', { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // navigate back to main page:
        window.location.href = '/';
    });
    ev.preventDefault()
};

const trashComment = (ev) => {
    const doIt = confirm('Are you sure you want to delete this blog post?');
    if (!doIt) {
        return;
    }
    const button = ev.currentTarget;
    const commentID = button.getAttribute('data-comment-id');

    fetch('/api/posts/' + activePost.id +'/comments/' + commentID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.reload();
    })
};

// creates the HTML to display the post:
const renderPost = (ev) => {
    const paragraphs = '<p>' + activePost.content.split('\n').join('</p><p>') + '</p>';
    const template = `
        <p id="confirmation" class="hide"></p>
        <h1>${activePost.title}</h1>
        <div class="date">${formatDate(activePost.published)}</div>
        <div class="content">${paragraphs}</div>
        <p>
            <strong>Author: </strong>${activePost.author}
        </p>
    `;
    document.querySelector('.post').innerHTML = template;
    toggleVisibility('view');

    // prevent built-in form submission:
    if (ev) { ev.preventDefault(); }
};

// creates HTML to display comments:
const renderComments = (ev) => {
    activeComments.forEach(function (arrayItem) {
        const paragraphs = '<p>' + arrayItem.comment.split('\n').join('</p><p>') + '</p>';
        const template = `
            <div class="comment comment-parent">
                <section class="content flex-content">
                    <p id="confirmation" class="hide"></p>
                    <div>${paragraphs}</div>
                    <p>
                        Author: ${arrayItem.author}
                    </p>
                </section>
                <section class="flex-trash">
                    <button type="button" class="trash" data-comment-id=${arrayItem._id.$oid}><i class="far fa-trash-alt"></i></button>
                </section>
            </div>
        `;
        document.querySelector('.comments').innerHTML += template;
    })

    const commentButtons = document.querySelectorAll('.trash');
    console.log(commentButtons);
    for (const deleteButton of commentButtons) {
         deleteButton.onclick = trashComment;
    }
//    toggleVisibility('view');
};

// creates the HTML to display the editable form:
const renderForm = () => {
    const htmlSnippet = `
        <div class="input-section">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" value="${activePost.title}">
        </div>
        <div class="input-section">
            <label for="author">Author</label>
            <input type="text" name="author" id="author" value="${activePost.author}">
        </div>
        <div class="input-section">
            <label for="content">Content</label>
            <textarea name="content" id="content">${activePost.content}</textarea>
        </div>
        <button class="btn btn-main" id="save" type="submit">Save</button>
        <button class="btn" id="cancel" type="submit">Cancel</button>
    `;

    // after you've updated the DOM, add the event handlers:
    document.querySelector('#post-form').innerHTML = htmlSnippet;
    document.querySelector('#save').onclick = updatePost;
    document.querySelector('#cancel').onclick = renderPost;
    toggleVisibility('edit');
};

const createComment = (ev) => {
    const url = window.location.href;
    id = url.substring(url.lastIndexOf('#') + 1);

    const data = {
        comment: document.querySelector('#content').value,
        author: document.querySelector('#author').value
    };
    console.log(data);
    fetch('/api/posts/' + id + '/comments/', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {console.log(res)})
        .then(res => {location.reload()});
};


const formatDate = (date) => {
    const options = { 
        weekday: 'long', year: 'numeric', 
        month: 'long', day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options); 
};

// handles what is visible and what is invisible on the page:
const toggleVisibility = (mode) => {
    if (mode === 'view') {
        document.querySelector('#view-post').classList.remove('hide');
        document.querySelector('#menu').classList.remove('hide');
        document.querySelector('#post-form').classList.add('hide');
        document.querySelector('#view-comments').classList.remove('hide');
    } else {
        document.querySelector('#view-post').classList.add('hide');
        document.querySelector('#menu').classList.add('hide');
        document.querySelector('#post-form').classList.remove('hide');
        document.querySelector('#view-comments').classList.add('hide');
    }
};

const showConfirmation = () => {
    document.querySelector('#confirmation').classList.remove('hide');
    document.querySelector('#confirmation').innerHTML = 'Post successfully saved.';
};
const showConfirmationComment = () => {
    const url = window.location.href;
    console.log(url);
    document.querySelector('#confirmation-com').classList.remove('hide');
    document.querySelector('#confirmation-com').innerHTML = 'Comment successfully saved.';
};

const showCommentCreation = () => {
    data = document.querySelector('#comment-create').classList;
    if (data == 'hide') {
        document.querySelector('#comment-create').classList.remove('hide');
    } else {
        document.querySelector('#comment-create').classList.add('hide');
        document.getElementById('comment-form').reset();
    }
};

// called when the page loads:
const initializePage = () => {
    // get the post from the server:
    getPost();
    getComments();
    // add button event handler (right-hand corner:
    document.querySelector('#edit-button').onclick = renderForm;
    document.querySelector('#delete-button').onclick = deletePost;
    document.querySelector('#create-com-button').onclick = showCommentCreation;
    document.querySelector('#cancel').onclick = showCommentCreation;
    document.querySelector('#save').onclick = createComment;
};

initializePage();
