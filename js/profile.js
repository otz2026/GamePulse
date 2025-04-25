import { auth, db } from './firebase.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';

// Анимации
gsap.from('.profile-card', { opacity: 0, y: 50, duration: 1, ease: 'power2.out' });

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      document.querySelector('.profile-card h2 span').textContent = data.nickname;
      document.querySelector('.profile-card p').innerHTML = `K/D: ${data.kdRatio} | Matches: ${data.matchesPlayed}`;
      document.querySelector('input[type="text"]').value = data.nickname;
      document.querySelector('input[type="email"]').value = data.email;
    }
  } else {
    window.location.href = 'login.html';
  }
});

document.querySelector('.cta-button').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (user) {
    const nickname = document.querySelector('input[type="text"]').value;
    try {
      await updateDoc(doc(db, 'users', user.uid), { nickname });
      alert('Profile updated!');
      document.querySelector('.profile-card h2 span').textContent = nickname;
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
});

document.querySelector('#logout').addEventListener('click', () => {
  auth.signOut();
});
