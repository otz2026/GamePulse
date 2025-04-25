import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';

// Анимации
gsap.from('div', { opacity: 0, y: 50, duration: 1, ease: 'power2.out' });

document.querySelector('.cta-button').addEventListener('click', async () => {
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;
  try {
    // Попробовать войти
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (error) {
    // Если вход не удался, зарегистрироваться
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        nickname: email.split('@')[0],
        email: email,
        kdRatio: 0,
        matchesPlayed: 0,
        createdAt: new Date().toISOString()
      });
      window.location.href = 'index.html';
    } catch (regError) {
      alert('Error: ' + regError.message);
    }
  }
});
