import { auth, db } from './firebase.js';
import { collection, addDoc, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';

// Анимации
gsap.from('h1', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
gsap.from('.cta-button', { opacity: 0, scale: 0.8, duration: 1, delay: 1, ease: 'back.out' });

// Проверка авторизации
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'login.html';
  }
});

// Matchmaking
document.querySelector('.cta-button').addEventListener('click', async () => {
  const user = auth.currentUser;
  if (user) {
    const map = document.querySelector('#mapFilter').value;
    const region = document.querySelector('#regionFilter').value;
    try {
      await addDoc(collection(db, 'matchmakingQueue'), {
        userId: user.uid,
        joinedAt: new Date().toISOString(),
        preferredMap: map,
        region: region
      });
      alert('Joined matchmaking queue!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
});

// Уведомления
const notificationsDiv = document.querySelector('#notifications');
const q = query(collection(db, 'notifications'), where('userId', '==', auth.currentUser?.uid || ''));
onSnapshot(q, (snapshot) => {
  notificationsDiv.innerHTML = '';
  snapshot.forEach((doc) => {
    const notif = doc.data();
    const div = document.createElement('div');
    div.className = 'bg-gray-700 p-4 rounded mb-2';
    div.textContent = notif.message;
    if (!notif.read) {
      div.classList.add('border-l-4', 'border-cyan-500');
    }
    notificationsDiv.appendChild(div);
  });
});

// Выход
document.querySelector('#logout').addEventListener('click', () => {
  auth.signOut();
});
