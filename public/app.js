// Declare player scores at the top level to ensure they are accessible globally
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 'player1';

document.addEventListener('DOMContentLoaded', function() {
    const beginBtn = document.getElementById('begin-btn');
    if (beginBtn) {
        beginBtn.addEventListener('click', submitPlayerInfo);
    }

    // Set up any other event listeners or initial setup
    startTimer(30, document.querySelector('#safeTimerDisplay'), switchPlayerTurn);
});

function submitPlayerInfo(event) {
    event.preventDefault();

    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);

    submitPlayer(player1Name, 1)
        .then(() => submitPlayer(player2Name, 2))
        .then(() => {
            window.location.href = 'grid.html';  // Redirect on successful save
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function submitPlayer(name, number) {
    const apiUrl = 'https://drivequest-bdcd0e241c4b.herokuapp.com/add-player';
    return fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name, playerNumber: number, scores: [] })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Failed to save player ${number} info`);
        return response.json();
    })
    .then(data => {
        console.log(`Player ${number} added:`, data);
    });
}

function loadQuestion(level, gridIndex) {
    localStorage.setItem('currentLevel', level);
    localStorage.setItem('currentGridIndex', gridIndex);
    fetchQuestionFromBackend(level);
}

function fetchQuestionFromBackend(level) {
    fetch(`https://drivequest-bdcd0e241c4b.herokuapp.com/questions.html?level=${level}`)
        .then(response => response.json())
        .then(data => {
            const count = data.count;
            const randomIndex = Math.floor(Math.random() * count);
            return fetch(`https://drivequest-bdcd0e241c4b.herokuapp.com/questions.html?level=${level}&skip=${randomIndex}&limit=1`);
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const questionData = data[0];
                console.log('Question data before storing:', questionData);
                localStorage.setItem('currentQuestion', JSON.stringify(questionData));
                window.location.href = 'questions.html'; // Redirect after storing the data
            } else {
                console.error('No questions available for this level');
            }
        })
        .catch(error => {
            console.error('Error fetching question:', error);
        });
}

function displayQuestion(questionData) {
    const questionContainer = document.querySelector('.question');
    questionContainer.textContent = questionData.question;
    const optionsContainer = document.querySelector('.options-container');
    optionsContainer.innerHTML = '';

    if (Array.isArray(questionData.options) && questionData.options.length > 0) {
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionElement.classList.add('option');
            optionElement.addEventListener('click', () => selectOption(optionElement, questionData.correctAnswerIndex));
            optionsContainer.appendChild(optionElement);
        });
    } else {
        console.error('No options available for the question');
    }

    currentCorrectAnswerIndex = questionData.correctAnswerIndex;
    document.getElementById('submitBtn').removeAttribute('disabled');
}

function selectOption(option, correctAnswerIndex) {
    var options = document.querySelectorAll('.option');
    options.forEach(function(opt) {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
    currentCorrectAnswerIndex = correctAnswerIndex; // Update the current correct answer index
}

// This function is triggered when a player submits an answer
function submitAnswer() {
    var selectedOption = document.querySelector('.option.selected');
    if (!selectedOption) {
        alert('Please select an option before submitting.');
        return;
    }
    
    var selectedOptionText = selectedOption.textContent;
    var correctAnswer = document.querySelector('.options-container').children[currentCorrectAnswerIndex].textContent;
    var feedbackText = '';
    var points = 0;

    if (selectedOptionText.trim() === correctAnswer.trim()) {
        feedbackText = 'Correct! You earned 10 points.';
        points = 10;
        let answeredGrids = JSON.parse(localStorage.getItem('answeredGrids') || '[]');
        answeredGrids.push(localStorage.getItem('currentGridIndex'));
        localStorage.setItem('answeredGrids', JSON.stringify(answeredGrids));
    } else {
        feedbackText = 'Incorrect! You lost 5 points.';
        points = -5;
    }

    updatePlayerScore(currentPlayer, points);

    document.getElementById('answerFeedback').textContent = feedbackText;
    // document.getElementById('scoreFeedback').textContent = `Current Score: ${currentPlayer === 'player1' ? player1Score : player2Score}`;
    showModal();

    resetGameForNextTurn();
}

window.onload = function () {
    // Disable already answered grid items
    let answeredGrids = JSON.parse(localStorage.getItem('answeredGrids') || '[]');
    answeredGrids.forEach(function(index) {
        let gridItem = document.querySelectorAll('.grid-item')[index];
        if (gridItem) {
            gridItem.onclick = null; // Remove the onclick event
            gridItem.style.opacity = '0.5'; // Dim the grid item to indicate it's disabled
        }
    });
};

function updatePlayerScore(currentPlayer, points) {
    let playerName = currentPlayer === 'player1' ? localStorage.getItem('player1Name') : localStorage.getItem('player2Name');
    
    fetch('https://drivequest-bdcd0e241c4b.herokuapp.com/update-score', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerName: playerName,
            points: points
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error('Failed to update player score: ' + errorData.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Score update response:', data);
        if (currentPlayer === 'player1') {
            player1Score += points;
        } else {
            player2Score += points;
        }
    })
    .catch(error => {
        console.error('Error updating player score:', error);
    });
}
