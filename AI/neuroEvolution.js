function nextGeneration() {
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    players[i] = getNewChild();
  }
  for (let i = 0; i < TOTAL; i++) {
    savedPlayers[i].dispose();
  }
  savedPlayers = [];
}

function crossover(parentA, parentB) {
  return tf.tidy(() => {
    const modelA = parentA.model;
    const modelB = parentB.model;

    const weightsA = modelA.getWeights();
    const weightsB = modelB.getWeights();

    const newWeights = [];

    for (let i = 0; i < weightsA.length; i++) {
      const shape = weightsA[i].shape;
      const valuesA = weightsA[i].dataSync();
      const valuesB = weightsB[i].dataSync();
      const newValues = new Float32Array(valuesA.length);

      for (let j = 0; j < valuesA.length; j++) {
        newValues[j] = random(1) > 0.5 ? valuesA[j] : valuesB[j];
      }

      newWeights[i] = tf.tensor(newValues, shape);
    }

    const childModel = parentA.createModel();
    childModel.setWeights(newWeights);

    return new Brain(childModel);
  });
}

function getNewChild() {
  let indexA = 0;
  let r = random(1);
  while (r > 0) {
    r -= savedPlayers[indexA].fitness;
    indexA++;
  }
  indexA--;

  let indexB = 0;
  r = random(1);
  while (r > 0) {
    r -= savedPlayers[indexB].fitness;
    indexB++;
  }
  indexB--;

  let parentA = savedPlayers[indexA];
  let parentB = savedPlayers[indexB];

  let childBrain = crossover(parentA.brain, parentB.brain);
  let child = new Player(childBrain);
  childBrain.dispose();
  child.mutate();

  return child;
}
function calculateFitness() {
  let sum = 0;
  for (let player of savedPlayers) {
    sum += player.score;
  }
  for (let player of savedPlayers) {
    player.fitness = player.score / sum;
  }
}
