document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('kdChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Янв', 'Фев', 'Мар', 'Апр'],
      datasets: [{
        label: 'K/D Ratio',
        data: [1.5, 1.7, 1.8, 2.1],
        borderColor: '#00DDEB',
        backgroundColor: 'rgba(0, 221, 235, 0.2)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
