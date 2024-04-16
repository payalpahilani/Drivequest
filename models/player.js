const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new mongoose.Schema({
  playerName: String,
  playerNumber: Number,
  scores: [Number] // Array of numbers representing scores
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
