const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswerIndex: { type: Number, required: true },
    level: { type: String, enum: ['easy', 'medium', 'hard'], required: true }
}, { collection: 'questions' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
