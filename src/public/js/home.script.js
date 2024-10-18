const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.getElementById('sidebar-wrapper');
const body = document.body;

// Toggle the sidebar
sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('active');  // Toggle sidebar visibility
    body.classList.toggle('shifted');    // Shift content when sidebar is active
});

// Close the sidebar when clicking outside of it
document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        body.classList.remove('shifted');
    }
});
