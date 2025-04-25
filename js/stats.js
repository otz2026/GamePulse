import { auth, db } from './firebase.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const mapFilter = document.querySelector('#mapFilter');
    const loadMatches = async () => {
      const map = mapFilter.value;
      const q = map
        ? query(collection(db, 'matches'), where('players', 'array-contains', user.uid), where('map', '==', map))
        : query(collection(db, 'matches'), where('players', 'array-contains', user.uid));
      const querySnapshot = await getDocs(q);
      const matches = [];
      querySnapshot.forEach((doc) => {
        matches.push(doc.data());
      });

      // Обновление таблицы
      const tableBody = document.querySelector('#matchesTable');
      tableBody.innerHTML = '';
      matches.forEach((match) => {
        const row = tableBody.insertRow();
        row.innerHTML = `<td class="p-2">${match.date}</td><td class="p-2">${match.map}</td><td class="p-2">${match.kdRatio}</td><td class="p-2">${match.result}</td>`;
      });

      // График
      const ctx = document.getElementById('kdChart').getContext('2d');
      if (window.kdChart) window.kdChart.destroy();
      window.kdChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: matches.map((m) => m.date.split('T')[0]),
          datasets: [{
            label: 'K/D Ratio',
            data: matches.map((m) => m.kdRatio),
            borderColor: '#00DDEB',
            backgroundColor: 'rgba(0, 221, 235, 0.2)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    };

    loadMatches();
    mapFilter.addEventListener('change', loadMatches);
  } else {
    window.location.href = 'login.html';
  }
});

document.querySelector('#logout').addEventListener('click', () => {
  auth.signOut();
});

// Анимации
gsap.from('table', { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: 'power2.out' });
gsap.from('#kdChart', { opacity: 0, scale: 0.8, duration: 1, delay: 1, ease: 'back.out' });
