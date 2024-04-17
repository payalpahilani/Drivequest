//to store player info in database
function submitPlayerInfo() {
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    // POST request to server endpoint to save player info
    // Save player 1
    fetch('http://localhost:3000/add-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerName: player1Name,
            playerNumber: 1,
            scores: []
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save player 1 info');
        }
        // Save player 2
        return fetch('http://localhost:3000/add-player', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName: player2Name,
                playerNumber: 2,
                scores: []
            }),
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save player 2 info');
        }
        // Both players saved successfully, redirect to grid page
        window.location.href = 'grid.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function loadQuestion(level) {
    localStorage.setItem('currentLevel', level); // Store the level in localStorage
    fetchQuestionFromBackend(level);
    document.getElementById('submitBtn').removeAttribute('disabled'); // Enable the submit button
}

function fetchQuestionFromBackend(level) {
    // First, fetch the count of questions for the specified level
    fetch(`http://localhost:3000/questions.html?level=${level}`)
        .then(response => response.json())
        .then(data => {
            const count = data.count;
            const randomIndex = Math.floor(Math.random() * count);
            // Then, fetch a random question using the random index
            return fetch(`http://localhost:3000/questions.html?level=${level}&skip=${randomIndex}&limit=1`);
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

let currentCorrectAnswerIndex;

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

let player1Score = 0;
let player2Score = 0;
let currentPlayer = 'player1';

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
    var currentLevel = localStorage.getItem('currentLevel'); // Retrieve the level from localStorage

    if (selectedOptionText.trim() === correctAnswer.trim()) {
        feedbackText = 'Correct! You earned 10 points.';
        points = 10;
    } else {
        feedbackText = 'Incorrect! You lost 5 points.';
        points = -5;
    }

    // Update the score based on the current player
    if (currentPlayer === 'player1') {
        player1Score += points;
        document.getElementById('player1').value = player1Score;
        // Update the score in the database for Player 1
        updatePlayerScore('Player 1', currentLevel, points);
    } else {
        player2Score += points;
        document.getElementById('player2').value = player2Score;
        // Update the score in the database for Player 2
        updatePlayerScore('Player 2', currentLevel, points);
    }

    // Display the feedback in the modal
    document.getElementById('answerFeedback').textContent = feedbackText;
    document.getElementById('scoreFeedback').textContent = `Current Score: ${currentPlayer === 'player1' ? player1Score : player2Score}`;
    showModal();

    // Reset selections for the next turn
    var options = document.querySelectorAll('.option');
    options.forEach(function(opt) {
        opt.classList.remove('selected');
    });
    document.getElementById('submitBtn').setAttribute('disabled', 'true');

    // Switch to the other player
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    document.querySelector('.player-turn').textContent = `${currentPlayer === 'player1' ? 'Player 1' : 'Player 2'} - It's your turn!`;
    
    // Enable the submit button for the next player
    if (currentPlayer === 'player2') {
        document.getElementById('submitBtn').removeAttribute('disabled');
    }
}

function updatePlayerScore(playerName, level, points) {
    // Send a POST request to update the player's score in the database
    fetch('http://localhost:3000/update-score', {
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
            throw new Error('Failed to update player score');
        }
        console.log('Player score updated successfully');
    })
    .catch(error => {
        console.error('Error updating player score:', error);
    });
}

function showModal() {
    document.getElementById('feedbackModal').style.display = 'block';
}

function closeModal() {
    const answerFeedback = document.getElementById('answerFeedback').textContent;
    const pointsEarned = answerFeedback.includes('Correct') && answerFeedback.includes('10 points');
    if (pointsEarned) {
        window.location.href = 'grid.html';
    } else {
        document.getElementById('feedbackModal').style.display = 'none';
    }
}


// countdown timer
// function startTimer(duration, display) {
//     var timer = duration, minutes, seconds;
//     setInterval(function () {
//         minutes = parseInt(timer / 60, 10)
//         seconds = parseInt(timer % 60, 10);
//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//         display.textContent = minutes + ":" + seconds;
//         if (--timer < 0) {
//             alert("Time's up!");
//             timer = 30;
//         }   
//     }, 1000);
// }

// window.onload = function () {
//     var time = 60 / 2, // your time in seconds here
//         display = document.querySelector('#safeTimerDisplay');
//     startTimer(time, display);
// };
