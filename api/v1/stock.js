const fs = require('fs');
const express = require('express');
const app = express();

// Define the routes
app.get('/api/v1/stock', (req, res) => {
  const files = [
    './accounts/minecraft.txt',
    './accounts/netflix.txt',
    './accounts/steam.txt',
  ];
  const accountCounts = {};

  // Fetch the accounts from the files.
  files.forEach((file) => {
    try {
      const data = fs.readFileSync(file, 'utf8');
      const accounts = data.trim().split('\n');
      accountCounts[file.replace('./accounts/', '').replace('.txt', '')] =
        accounts.length;
    } catch (err) {
      accountCounts[file.replace('./accounts/', '').replace('.txt', '')] = 0;
    }
  });

  res.json(accountCounts);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
