// // document.addEventListener('DOMContentLoaded', function() {
// //     var elems = document.querySelectorAll('.modal');
// //     M.Modal.init(elems);
// // });

// // // Function to open the edit modal and pre-fill the comment
// // function openEditModal(commentId, commentText) {
// //     // Set the current comment in the textarea
// //     document.getElementById('commentText').value = commentText;
// //     M.textareaAutoResize(document.getElementById('commentText'));

// //     // Set the form action dynamically
// //     const editForm = document.getElementById('editCommentForm');
// //     editForm.action = `/comment/${commentId}/editcomment?_method=PATCH`;

// //     // Open the modal
// //     const editModal = M.Modal.getInstance(document.getElementById('editCommentModal'));
// //     editModal.open();
// // }

// // // Function to submit the form when the user clicks Save
// // function submitEditForm() {
// //     document.getElementById('editCommentForm').submit();
// // }


// document.addEventListener('DOMContentLoaded', function () {
//     // Toggle the comment options menu (ellipsis)
//     const ellipsisButtons = document.querySelectorAll('.ellipsis-btn');
//     ellipsisButtons.forEach((btn) => {
//         btn.addEventListener('click', function (e) {
//             const menu = btn.nextElementSibling;
//             menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
//         });
//     });

//     // Toggle the edit comment form
//     const editButtons = document.querySelectorAll('.edit-btn');
//     editButtons.forEach((btn) => {
//         btn.addEventListener('click', function (e) {
//             const commentContainer = btn.closest('.comment-container');
//             const commentForm = commentContainer.querySelector('.edit-comment-form');
//             const commentText = commentContainer.querySelector('.comment p');

//             // Hide comment text and show the form
//             commentText.style.display = 'none';
//             commentForm.style.display = 'block';

//             // Hide the menu
//             btn.closest('.comment-menu').style.display = 'none';
//         });
//     });
// });


function openEditLightbox(commentId, commentContent) {
    // Show the lightbox
    document.getElementById('editCommentLightbox').style.display = 'flex';

    // Set the current comment content in the textarea
    document.getElementById('editCommentTextarea').value = commentContent;

    // Set the form action dynamically to handle the correct comment update
    const editForm = document.getElementById('editCommentForm');
    editForm.action = `/comment/${commentId}/editcomment?_method=PATCH`;
}

// Function to close the lightbox
function closeEditLightbox() {
    document.getElementById('editCommentLightbox').style.display = 'none';
}

// Function to submit the form when the "Save" button is clicked
function submitEditForm() {
    document.getElementById('editCommentForm').submit();
}