function loadQuestion() {
   
    // Hide the background grid
    document.getElementById('gridContainerWrapper').style.display = 'none';

    // Fetches the content of the question page
    fetch('questions.html')
        .then(response => response.text())
        .then(data => {
            // To Display the questions
            document.getElementById('questionContainer').innerHTML = data;
            document.getElementById('questionContainer').style.display = 'block';
        });
}
//Taking turns
let currentPlayer = 1; // Initialize current player

function displayPlayerTurn() {
    const playerTurnElement = document.querySelector('.player-turn');
    playerTurnElement.textContent = `Player ${currentPlayer} - It's your turn!`;
}
function switchPlayerTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Toggle between player 1 and player 2
    displayPlayerTurn(); 
}
//function to handle answer selection

let score = 0; // Initialize the player's score

function selectOption(option) {
    var options = document.querySelectorAll('.option');
    options.forEach(function(opt) {
        opt.classList.remove('selected');
    });
    // to highlight selected answer
    option.classList.add('selected');

    //button is visible
    document.getElementById('submitBtn').removeAttribute('disabled');
}
//Function to handle answer submission
function submitAnswer() {
    var selectedOption = document.querySelector('.option.selected');
    if (selectedOption) {
        var selectedText = selectedOption.textContent;
        
        // Check if the selected option is correct
        if (selectedText.trim() === 'C. Failing to remain at the scene of an accident') {
            // Increment the score if the answer is correct
            score++;
            // Update the score display for the current player
            var scoreDisplay = document.getElementById('player' + currentPlayer);
            scoreDisplay.value = score;
            // Provide feedback to the player
            alert('Correct! You earned a point.');
        } else {
            // Provide feedback to the player for incorrect answer
            alert('Incorrect! Try again.');
        }

        // Reset selected option and disable submit button
        var options = document.querySelectorAll('.option');
        options.forEach(function(opt) {
            opt.classList.remove('selected');
        });
        document.getElementById('submitBtn').setAttribute('disabled', 'true');
    }

}

  // countdown timer
  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            alert("Time's up!");
            timer = 30;

            // timer = duration; // uncomment this line to reset timer automatically after reaching 0
        }   
    }, 1000);
}

window.onload = function () {
    var time = 60 / 2, // your time in seconds here
        display = document.querySelector('#safeTimerDisplay');
    startTimer(time, display);
};


   