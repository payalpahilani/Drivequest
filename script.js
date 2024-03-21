console.log("works");

var timeLeft = 60; // 60 seconds = 1 minute

function updateTimer() {
  var minutes = Math.floor(timeLeft / 60);
  var seconds = timeLeft % 60;
  document.getElementById('timer').innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

  if (timeLeft <= 0) {
    clearInterval(countdown);
    document.getElementById('timer').innerHTML = "0:00";
    alert("Time's up!");
  } else {
    timeLeft--;
  }
}

var countdown = setInterval(updateTimer, 1000);
