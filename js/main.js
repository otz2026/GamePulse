document.addEventListener('DOMContentLoaded', () => {
  gsap.from('h1', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
  gsap.from('p', { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: 'power2.out' });
  gsap.from('.cta-button', { opacity: 0, scale: 0.8, duration: 1, delay: 1, ease: 'back.out' });
});
