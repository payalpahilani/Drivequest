const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('./models/question.js');
const Player = require('./models/player.js');

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://payalp:drivequest2024@atlascluster.zrn4s0n.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster', {
    dbName: 'drivequest',
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

// Add a new player
app.post('/add-player', async (req, res) => {
    const { playerName, playerNumber, scores } = req.body;
    try {
        const newPlayer = new Player({ playerName, playerNumber, scores: scores || [] });
        await newPlayer.save();
        res.status(201).json({ message: "Player added successfully", player: newPlayer });
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ message: "Error adding player", error: error.message });
    }
});

// Fetch questions
app.get('/questions.html', async (req, res) => {
    const { level, skip, limit } = req.query;
    try {
        if (skip && limit) {
            const count = await Question.countDocuments({ level });
            const randomIndex = Math.max(0, Math.min(count - 1, parseInt(skip)));
            const question = await Question.findOne({ level }).skip(randomIndex).limit(parseInt(limit));
            res.json([question]);
        } else {
            const count = await Question.countDocuments({ level });
            res.json({ count });
        }
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a player's score
app.patch('/update-score', async (req, res) => {
    const { playerName, points } = req.body;
    console.log(`Updating score for ${playerName} with points: ${points}`);  // Debug log
  
    try {
        const player = await Player.findOneAndUpdate(
            { playerName: playerName },
            { $push: { scores: points } },
            { new: true }
        );
  
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
  
        res.status(200).json({ message: "Score updated successfully", player: player });
    } catch (error) {
        console.error('Error updating scores:', error);
        res.status(500).json({ message: "Error updating scores", error: error.message });
    }
  });  


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
