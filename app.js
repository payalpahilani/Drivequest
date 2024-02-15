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

function selectOption(option) {
    // to remove selected class from all options
    var options = document.querySelectorAll('.option');
    options.forEach(function(item) {
        item.classList.remove('selected');
    });

    // to highlight selected answer
    option.classList.add('selected');
}