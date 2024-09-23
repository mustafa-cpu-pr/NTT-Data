const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // File system module for reading/writing JSON files
const app = express();
const port = 4500;

// CORS configuration 
const corsOptions = {
  origin: '*', // Allow requests from any origin; replace with specific origin if needed
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS configuration
app.use(express.json()); // To parse JSON data

// Serve static files from 'public' directory 
app.use(express.static(path.join(__dirname, 'public')));

// Path to the data.json file
const filePath = path.join(__dirname, 'data.json'); // Updated path to data.json

// Route to serve JSON data from data.json (GET request)
app.get('/api/users', (req, res) => {
  // Read the existing data from data.json
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ message: 'Error reading JSON file' });
    }

    // Parse and send the data
    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data); // Parse only if data exists
    }

    res.json(jsonData);
  });
});

// Route to handle POST request for generating and saving JSON data to data.json
app.post('/api/generate', (req, res) => {
  const newData = req.body; // Get new data from the request body

  // Read the existing data from data.json
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ message: 'Error reading JSON file' });
    }

    // Parse the current data in the file
    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }

    // Append the new data (ensure newData is in the correct format)
    if (Array.isArray(newData)) {
      jsonData = [...jsonData, ...newData]; // Append an array of new entries
    } else {
      jsonData.push(newData); // Append a single new entry
    }

    // Write the updated data back to data.json
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to JSON file:', err);
        return res.status(500).json({ message: 'Error writing JSON file' });
      }

      // Respond with success message and updated data
      res.json({ message: 'JSON data saved successfully', data: jsonData });
    });
  });
});

// Route to handle root URL
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
