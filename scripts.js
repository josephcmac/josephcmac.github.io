// Smooth scrolling for navigation
document.querySelectorAll('a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.hash) {
      e.preventDefault();
      document.querySelector(this.hash).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

