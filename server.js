const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('./models/question.js');
const Player = require('./models/player.js'); 

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://payalp:drivequest2024@atlascluster.zrn4s0n.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster',
{
  dbName: 'drivequest',
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Endpoint to add a new player
app.post('/add-player', async (req, res) => {
  try {
    const { playerName, playerNumber, scores } = req.body;
    const newPlayer = new Player({
      playerName,
      playerNumber,
      scores: scores || [] // Default to an empty array if no scores are provided
    });
    await newPlayer.save();
    res.status(201).json({ message: "Player added successfully", player: newPlayer });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ message: "Error adding player", error: error.message });
  }
});

// Define endpoint for fetching questions
app.get('/questions.html', async (req, res) => {
   const { level, skip, limit } = req.query;
   try {
       if (typeof skip !== 'undefined' && typeof limit !== 'undefined') {
           // If skip and limit are provided, return a random question
           const count = await Question.countDocuments({ level: level });
           const randomIndex = Math.max(0, Math.min(count - 1, parseInt(skip)));
           const question = await Question.findOne({ level: level }).skip(randomIndex).limit(parseInt(limit));
           res.json([question]); // Wrap the question in an array for consistency
       } else {
           // If skip and limit are not provided, return the count of questions for the specified level
           const count = await Question.countDocuments({ level: level });
           res.json({ count });
       }
   } catch (error) {
       console.error('Error fetching question:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
});


// Endpoint to update a player's score
app.patch('/update-score', async (req, res) => {
  try {
    const { playerName, points } = req.body;
    const player = await Player.findOne({ playerName: playerName });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    // Add the points to the player's scores array
    player.scores.push(points);
    await player.save();
    res.status(200).json({ message: "Score updated successfully", player: player });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ message: "Error updating score", error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
