// script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Global Variables / State ---
    let posts = [];
    let editingPostId = null; // Track the ID of the post being edited

    // --- DOM Element Selection ---
    const postForm = document.getElementById('post-form');
    const postTitleInput = document.getElementById('post-title');
    const postContentInput = document.getElementById('post-content');
    const postIdInput = document.getElementById('post-id'); // Hidden input
    const titleError = document.getElementById('title-error');
    const contentError = document.getElementById('content-error');
    const postsContainer = document.getElementById('posts-container');

    // --- Utility Functions ---
    function generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    function savePostsToLocalStorage() {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function loadPostsFromLocalStorage() {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            posts = JSON.parse(storedPosts);
        }
    }

    function clearForm() {
        postTitleInput.value = '';
        postContentInput.value = '';
        postIdInput.value = ''; // Clear the hidden input
        editingPostId = null;
        titleError.textContent = '';
        contentError.textContent = '';
    }

    // --- Render Posts Function ---
    function renderPosts() {
        postsContainer.innerHTML = ''; // Clear existing posts

        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="edit-button" data-id="${post.id}">Edit</button>
                <button class="delete-button" data-id="${post.id}">Delete</button>
            `;
            postsContainer.appendChild(postDiv);
        });
    }

    // --- Handle New Post Form Submission ---
    postForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();

        // --- Validation ---
        titleError.textContent = '';
        contentError.textContent = '';
        let isValid = true;

        if (!title) {
            titleError.textContent = 'Title is required.';
            isValid = false;
        }
        if (!content) {
            contentError.textContent = 'Content is required.';
            isValid = false;
        }

        if (!isValid) {
            return; // Stop submission if invalid
        }

        if (editingPostId) {
            // --- Editing Existing Post ---
            const index = posts.findIndex(post => post.id === editingPostId);
            if (index !== -1) {
                posts[index].title = title;
                posts[index].content = content;
            }
        } else {
            // --- Creating New Post ---
            const newPost = {
                id: generateId(),
                title: title,
                content: content,
                timestamp: new Date().getTime()
            };
            posts.push(newPost);
        }

        savePostsToLocalStorage();
        renderPosts();
        clearForm();
    });

    // --- Handle Delete Post ---
    postsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const postId = event.target.dataset.id;
            posts = posts.filter(post => post.id !== postId); // Remove post
            savePostsToLocalStorage();
            renderPosts();
        }
    });

    // --- Handle Edit Post ---
    postsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button')) {
            const postId = event.target.dataset.id;
            editingPostId = postId; // Set the editing post ID

            const postToEdit = posts.find(post => post.id === postId);
            if (postToEdit) {
                postTitleInput.value = postToEdit.title;
                postContentInput.value = postToEdit.content;
                postIdInput.value = postToEdit.id; // Store the ID in the hidden input
            }
        }
    });

    // --- Initial Load ---
    loadPostsFromLocalStorage();
    renderPosts();
});