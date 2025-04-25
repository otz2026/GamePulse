import { auth, db } from './firebase.js';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';

// Анимации
gsap.from('h1', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
gsap.from('div', { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: 'power2.out' });

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const loadFriends = async () => {
    // Запросы в друзья
    const requestsQ = query(collection(db, 'friends'), where('userId2', '==', user.uid), where('status', '==', 'pending'));
    const requestsSnapshot = await getDocs(requestsQ);
    const requestsList = document.querySelector('#friendRequests');
    requestsList.innerHTML = '';
    requestsSnapshot.forEach((doc) => {
      const friend = doc.data();
      const li = document.createElement('li');
      li.className = 'p-2 bg-gray-700 rounded mb-2 flex justify-between';
      li.innerHTML = `
        <span>${friend.userId1}</span>
        <button class="accept-friend bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded" data-id="${doc.id}">Accept</button>
      `;
      requestsList.appendChild(li);
    });

    // Список друзей
    const friendsQ = query(collection(db, 'friends'), where('status', '==', 'accepted'), where('userId1', '==', user.uid));
    const friendsSnapshot = await getDocs(friendsQ);
    const friendsList = document.querySelector('#friendsList');
    friendsList.innerHTML = '';
    friendsSnapshot.forEach((doc) => {
      const friend = doc.data();
      const li = document.createElement('li');
      li.className = 'p-2 bg-gray-700 rounded mb-2';
      li.textContent = friend.userId2;
      friendsList.appendChild(li);
    });
  };

  loadFriends();

  // Добавить друга
  document.querySelector('#addFriend').addEventListener('click', async () => {
    const email = document.querySelector('#friendEmail').value;
    const userQ = query(collection(db, 'users'), where('email', '==', email));
    const userSnapshot = await getDocs(userQ);
    if (userSnapshot.empty) {
      alert('User not found!');
      return;
    }
    const friend = userSnapshot.docs[0].data();
    try {
      await addDoc(collection(db, 'friends'), {
        friendshipId: `${user.uid}_${friend.userId}`,
        userId1: user.uid,
        userId2: friend.userId,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'notifications'), {
        notificationId: `notif_${Date.now()}`,
        userId: friend.userId,
        type: 'friend_request',
        message: `${user.email} sent you a friend request`,
        createdAt: new Date().toISOString(),
        read: false
      });
      alert('Friend request sent!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  // Принять запрос
  document.querySelector('#friendRequests').addEventListener('click', async (e) => {
    if (e.target.classList.contains('accept-friend')) {
      const docId = e.target.dataset.id;
      try {
        await updateDoc(doc(db, 'friends', docId), { status: 'accepted' });
        loadFriends();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  });
});

document.querySelector('#logout').addEventListener('click', () => {
  auth.signOut();
});
