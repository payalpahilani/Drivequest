const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    playerName: { type: String, required: true },
    playerNumber: { type: Number, required: true },
    scores: [Number]
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
