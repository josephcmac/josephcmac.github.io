document.getElementById('servicesBtn').addEventListener('click', function() {
    displaySection('services');
});

document.getElementById('aboutBtn').addEventListener('click', function() {
    displaySection('about');
});

document.getElementById('contactBtn').addEventListener('click', function() {
    displaySection('contact');
});

function displaySection(id) {
    // Get an array of all sections
    var sections = document.getElementsByClassName('infoSection');

    // Hide all sections
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }

    // Show the selected section
    document.getElementById(id).style.display = 'block';
}
