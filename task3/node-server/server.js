const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Use CORS to allow requests from different origins
app.use(cors());
app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Chart Config API');
});

// Route to get chart configuration
app.get('/api/chart-config', (req, res) => {
  const filePath = path.join(__dirname, 'chart-config.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, send an empty config
        res.status(404).send('Config file not found');
      } else {
        // Other errors
        res.status(500).send('Error reading config file');
      }
      return;
    }
    res.send(data);
  });
});

// Route to save chart configuration
app.post('/api/chart-config', (req, res) => {
  const filePath = path.join(__dirname, 'chart-config.json');
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      res.status(500).send('Error writing config file');
      return;
    }
    res.send('Config saved');
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send('Sorry, we could not find that!');
});

// Start the server on port 3000
app.listen(2000, () => {
  console.log('Server running on port 2000');
});
