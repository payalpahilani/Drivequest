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

//function to handle answer selection
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

// JavaScript function to handle answer submission
function submitAnswer() {
    var selectedOption = document.querySelector('.option.selected').textContent;
    alert('You selected: ' + selectedOption);
}
//Function to keep the score of the players----------------------------------------------------------------------------------------------------------------
let player1Score = 0;
let player2Score = 0;


// Example usage: Call this function to reset scores
function resetScores() {
    player1Score = 0;
    player2Score = 0;
    document.getElementById('player1').value = player1Score;
    document.getElementById('player2').value = player2Score;
}