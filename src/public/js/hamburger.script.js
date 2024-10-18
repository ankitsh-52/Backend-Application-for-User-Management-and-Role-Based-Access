const sidebar = document.getElementById('sidebar-wrapper');
const toggleBtn = document.getElementById('sidebar-toggle');
const mainContent = document.getElementById('main-content');

// Toggle sidebar when the hamburger button is clicked
toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
});

// Hide sidebar if clicking outside of it
document.addEventListener('click', function (event) {
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});
