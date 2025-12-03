# Rock Paper Scissors AI

## Live Demonstration

### Launch Live VS Code Environment

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/natinew77-creator/ML-Rock-Paper-Scissors)
> **Note:** Click the button above.



## Project Overview
This project is a Machine Learning solution for the **Rock Paper Scissors** challenge from freeCodeCamp. The goal was to create an AI player that can consistently beat four different bots (Quincy, Abbey, Kris, and Mrugesh) with a **win rate of at least 60%**.

## Strategy & Algorithm
The solution uses a **Multi-Strategy Selector** that dynamically adapts to the opponent. Instead of a single algorithm, the bot tracks four different strategies simultaneously and selects the best one based on recent performance.

*   **Strategy 1 (Quincy Counter):** Exploits Quincy's fixed 5-move pattern.
*   **Strategy 2 (Abbey Counter):** Simulates Abbey's logic (which tracks my history) to predict her next move, then counters it.
*   **Strategy 3 (Kris Counter):** Predicts Kris will play the counter to my last move.
*   **Strategy 4 (Mrugesh Counter):** Predicts Mrugesh will play the counter to my most frequent move in the last 10 rounds.
*   **Dynamic Selection:** The bot calculates which strategy would have won the *last* round and switches to the most successful one for the next move.

## Final Results
My AI successfully defeated all four bots with significantly improved win rates:

| Opponent | Win Rate | Result |
| :--- | :--- | :--- |
| **Quincy** | **100.0%** | Passed |
| **Abbey** | **87.5%** |  Passed |
| **Kris** | **100.0%** |  Passed |
| **Mrugesh** | **99.7%** |  Passed |

## Live Code Testing

### Run Automated Tests
To verify the win rates against all 4 bots, run the main script:
```bash
python3 main.py
```

### Play Interactively
To play against the bots yourself or test specific scenarios, you can modify `main.py` to uncomment the interactive mode:
```python
# In main.py, uncomment:
# play(human, abbey, 20, verbose=True)
```

## Technologies
* **Python**
* **GitHub** 
