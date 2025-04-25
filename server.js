const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/matchmaking', (req, res) => {
  res.json({ message: 'Matchmaking started', players: [] });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
