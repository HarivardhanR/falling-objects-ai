# Falling Objects AI

## Overview

Falling Objects AI is a game that demonstrates the power of Neuro Evolution, where a population of players learns to avoid falling objects over time. This project uses p5.js for the game rendering and TensorFlow.js for the AI models.

## Play the Game

Explore the game [here](https://harivardhanr.github.io/falling-objects-ai/).

## How to Play

1. **Neuro Evolution (Untrained)**

   - Click the "Neuro Evolution (Untrained)" button to start the training process.
   - Adjust the brick frequency and population size using the sliders.
   - Observe the players as they learn and improve over generations.
   - Save the model at any point if you wish to preserve the learned behavior.

2. **Neuro Evolution (Trained)**

   - Click the "Neuro Evolution (Trained)" button to load and play with a pre-trained model.
   - Watch the trained model avoid the falling objects efficiently, even as the brick frequency increases.

3. **Human Mode**
   - Click the "Human" button to take control.
   - Use the left and right arrow keys to move your player and avoid the falling objects.

## Adjustments and Controls

- **Brick Frequency**: Adjust this slider to control how often bricks fall.
- **Population Size**: Adjust this slider to change the number of players in the untrained population.
- **Speed**: Adjust this slider to speed up the learning process by skipping frames.
- **Save Model**: Click the "Save Model" button to save the current state of the trained model.

## Observations

- Players generally start to perform significantly better around 300 generations in the Neuro Evolution (Untrained) mode.
- The trained model plays very well with a brick frequency of 1 and can handle frequencies up to 40 efficiently.

## Technologies Used

- **p5.js**: For game rendering.
- **TensorFlow.js**: For AI model training and inference.
- **Chart.js**: For visualizing the average scores and performance.

## Conclusion

Falling Objects AI is a fun and interactive way to explore the concepts of Neuro Evolution and see the progress of AI learning in real-time. Adjust the parameters, save your models, and see how well you can train your players to master the game.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
