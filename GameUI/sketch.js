let TOTAL = 250;
let players = [];
let savedPlayers = [];
let bricks = [];
let counter = 0;
let speedSlider, populationSlider, frequencySlider;
let frequency = 75;
let playerImg, brickImage;
let drawFunction;

let neuroutBestScore = 0;

let generation = 1;

let trainedPlayer;

let playingBy = 'neurout';

let averageScoresChart;

let humanGameOver, neurotGameOver;

function preload() {
  playerImg = loadImage('assets/player.svg');
  brickImage = loadImage('assets/brick.svg');
  loadTrainedModel();
}

function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
}

function hideUnrelatedStuff() {
  const populationSlider = document.getElementById(
    'population-slider-container'
  );
  const speedSlider = document.getElementById('speed-slider-container');

  const humanScoreContainer = document.getElementById('human-score-container');
  const neurotScoreContainer = document.getElementById(
    'neurot-score-container'
  );
  const neuroutScoreContainer = document.getElementById(
    'neurout-score-container'
  );

  const neuroutAlgorithmInfo = document.getElementById(
    'neurout-algorithm-info'
  );
  if (playingBy === 'human') {
    populationSlider.style.display = 'none';
    speedSlider.style.display = 'none';
    humanScoreContainer.style.display = 'block';
    neurotScoreContainer.style.display = 'none';
    neuroutScoreContainer.style.display = 'none';
    neuroutAlgorithmInfo.style.display = 'none';
  } else if (playingBy === 'neurot') {
    populationSlider.style.display = 'none';
    speedSlider.style.display = 'none';
    humanScoreContainer.style.display = 'none';
    neurotScoreContainer.style.display = 'block';
    neuroutScoreContainer.style.display = 'none';
    neuroutAlgorithmInfo.style.display = 'none';
  } else if (playingBy === 'neurout') {
    populationSlider.style.display = 'block';
    speedSlider.style.display = 'block';
    humanScoreContainer.style.display = 'none';
    neurotScoreContainer.style.display = 'none';
    neuroutScoreContainer.style.display = 'block';
    neuroutAlgorithmInfo.style.display = 'block';
  }
}

async function loadTrainedModel() {
  const model = await tf.loadLayersModel('savedModel/gen-521-model.json');
  // console.log("Model loaded:", model);
  const trainedBrain = new Brain(model);
  trainedPlayer = new Player(trainedBrain);
  trainedBrain.model.dispose();
}

async function saveModel() {
  if (players && players.length > 0) {
    await players[0].brain.model.save(
      'downloads://gen-' + generation + '-model'
    );
  }
}

function setup() {
  const canvas = createCanvas(600, 400);
  canvas.parent('canvas-container');
  tf.setBackend('cpu');
  const ctx = document.getElementById('average-scores-chart').getContext('2d');

  averageScoresChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Average Scores',
          data: [],
          borderWidth: 1,
          borderColor: '#d35d6e',
          pointRadius: 0,
        },
      ],
    },

    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          title: {
            display: true,
            text: 'Generations',
            font: {
              size: 14,
            },
          },

          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
    },
  });

  humanGameOver = document.getElementById('human-game-over');
  neurotGameOver = document.getElementById('neurot-game-over');

  speedSlider = document.getElementById('speed-slider');
  const speedLabel = document.getElementById('speed-label');
  populationSlider = document.getElementById('population-slider');
  const populationLabel = document.getElementById('population-label');
  frequencySlider = document.getElementById('frequency-slider');
  const frequencyLabel = document.getElementById('frequency-label');

  speedSlider.addEventListener('input', () => {
    speedLabel.innerText = `Speed: ${speedSlider.value}x`;
  });

  populationSlider.addEventListener(
    'input',
    debounce(() => {
      populationLabel.innerText = `Population: ${populationSlider.value}`;
      TOTAL = parseInt(populationSlider.value);
      resetPopulation();
    }, 300)
  );

  frequencySlider.addEventListener(
    'input',
    debounce(() => {
      frequencyLabel.innerText = `Brick Frequency: ${frequencySlider.value}`;
      frequency = 76 - parseInt(frequencySlider.value);
      resetPopulation();
    }, 300)
  );

  document.getElementById('human').addEventListener('click', () => {
    drawFunction = humanDraw;
    playingBy = 'human';
    resetPopulation();
    hideUnrelatedStuff();
  });

  document.getElementById('neurout').addEventListener('click', () => {
    drawFunction = neuroEvolutionUntrainedDraw;
    playingBy = 'neurout';
    resetPopulation();
    hideUnrelatedStuff();
  });

  document.getElementById('neurot').addEventListener('click', () => {
    drawFunction = neuroEvolutionTrainedDraw;
    playingBy = 'neurot';
    resetPopulation();
    hideUnrelatedStuff();
  });

  resetPopulation();
  drawFunction = neuroEvolutionUntrainedDraw;
}

function resetPopulation() {
  // console.log("reset population");
  for (let player of players) {
    if (player.brain && player.brain.dispose) {
      player.brain.dispose();
    }
  }
  for (let player of savedPlayers) {
    if (player.brain && player.brain.dispose) {
      player.brain.dispose();
    }
  }

  humanGameOver.style.display = 'none';
  neurotGameOver.style.display = 'none';

  if (trainedPlayer) {
    trainedPlayer.score = 0;
  }

  players = [];
  savedPlayers = [];
  bricks = [];
  counter = 0;
  neuroutBestScore = 0;

  generation = 1;

  averageScoresChart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });
  averageScoresChart.data.labels = [];
  averageScoresChart.update();

  let playerCount;
  if (playingBy === 'human') {
    playerCount = 1;
  } else if (playingBy === 'neurot') {
    playerCount = 0;
  } else {
    playerCount = TOTAL;
  }
  for (let i = 0; i < playerCount; i++) {
    players[i] = new Player();
  }
  loop();
}

function draw() {
  drawFunction();
}

function neuroEvolutionUntrainedDraw() {
  for (let n = 0; n < speedSlider.value; n++) {
    if (counter % frequency === 0) {
      bricks.push(new Brick());
    }
    counter++;

    for (let i = bricks.length - 1; i >= 0; i--) {
      bricks[i].update();

      for (let j = players.length - 1; j >= 0; j--) {
        if (bricks[i].hits(players[j]) || players[j].killed(600)) {
          savedPlayers.push(players.splice(j, 1)[0]);
        }
      }

      if (bricks[i].offscreen()) {
        bricks.splice(i, 1);
      }
    }

    for (let player of players) {
      player.think(bricks);
      player.update();
    }

    if (players.length === 0) {
      counter = 0;
      calculateAverageScore();
      nextGeneration();
      bricks = [];
      generation++;
    }
  }

  background('#e0e0e0');

  for (let player of players) {
    player.show();
  }

  for (let brick of bricks) {
    brick.show();
  }
  document.getElementById(
    'neurout-best-score'
  ).textContent = `Best Score: ${neuroutBestScore}`;
  document.getElementById(
    'neurout-current-score'
  ).textContent = `Current Score: ${players[0].score}`;

  if (players[0].score > neuroutBestScore) {
    neuroutBestScore = players[0].score;
  }
}

function calculateAverageScore() {
  let sum = 0;
  for (let player of savedPlayers) {
    sum += player.score;
  }
  const averageScore =
    savedPlayers.length > 0 ? Math.floor(sum / savedPlayers.length) : 0;

  updateChart(averageScore);
}
function updateChart(averageScore) {
  averageScoresChart.data.labels.push(generation);
  averageScoresChart.data.datasets[0].data.push(averageScore);
  averageScoresChart.update();
}

function humanDraw() {
  if (counter % frequency === 0) {
    bricks.push(new Brick());
  }
  counter++;

  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].update();

    if (bricks[i].hits(players[0]) || players[0].killed(600)) {
      noLoop(); // Game over
      humanGameOver.style.display = 'block';
    }

    if (bricks[i].offscreen()) {
      bricks.splice(i, 1);
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    players[0].left();
  } else if (keyIsDown(RIGHT_ARROW)) {
    players[0].right();
  }

  players[0].update();

  background('#e0e0e0');
  players[0].show();

  for (let brick of bricks) {
    brick.show();
  }
  document.getElementById(
    'human-score'
  ).textContent = `Human Score: ${players[0].score}`;
}

function neuroEvolutionTrainedDraw() {
  if (trainedPlayer) {
    if (counter % frequency === 0) {
      bricks.push(new Brick());
    }
    counter++;

    for (let i = bricks.length - 1; i >= 0; i--) {
      bricks[i].update();

      if (bricks[i].hits(trainedPlayer) || trainedPlayer.killed(600)) {
        noLoop(); // Game over
        neurotGameOver.style.display = 'block';
      }

      if (bricks[i].offscreen()) {
        bricks.splice(i, 1);
      }
    }

    trainedPlayer.think(bricks);
    trainedPlayer.update();

    background('#e0e0e0');
    trainedPlayer.show();

    for (let brick of bricks) {
      brick.show();
    }
    document.getElementById(
      'neurot-score'
    ).textContent = `Trained Model Score: ${trainedPlayer.score}`;
  }
}
