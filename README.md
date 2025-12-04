# 🤖 Adaptive Rock Paper Scissors AI

<a href="https://www.python.org/">
  <img src="https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
</a>
<a href="https://www.freecodecamp.org/learn/machine-learning-with-python/">
  <img src="https://img.shields.io/badge/Machine%20Learning-Pattern%20Recognition-green?style=for-the-badge" alt="Machine Learning">
</a>
<a href="https://github.com/natinew77-creator/ML-Rock-Paper-Scissors">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Status">
</a>

A high-performance AI agent designed to defeat multiple distinct bot strategies in the classic game of Rock Paper Scissors. This project demonstrates the application of **ensemble methods**, **pattern recognition**, and **adaptive strategy selection** to achieve a win rate exceeding 60% against four unique opponent archetypes.

## 📋 Project Overview

This solution was developed for the freeCodeCamp Machine Learning certification. The core challenge involves creating a single agent capable of adapting to four different opponents:
1.  **Quincy**: A fixed-pattern bot.
2.  **Abbey**: A frequency-analysis bot (Markov Chain-like).
3.  **Kris**: A reactive counter-strategy bot.
4.  **Mrugesh**: A statistical lookback bot.

My solution implements a **Meta-Strategy Ensemble** that tracks the performance of multiple sub-strategies in real-time and dynamically switches to the most effective one for each opponent.

## 🧠 Technical Architecture

The agent does not rely on a single algorithm. Instead, it employs a **Multi-Arm Bandit** approach where four distinct predictors run in parallel. A scoring system evaluates which predictor would have won the *previous* round and selects the highest-scoring predictor for the *next* move.

### Sub-Strategies Implemented

| Strategy Name | Target Opponent | Technical Mechanism |
| :--- | :--- | :--- |
| **Pattern Matcher** | Quincy | **Cyclic Pattern Recognition**: Detects and exploits the fixed 5-move repetition cycle `[R, R, P, P, S]`. |
| **Predictive Modeling** | Abbey | **2nd-Order Markov Chain Simulation**: Simulates the opponent's own logic (which tracks my history) to predict their next move, then counters it. |
| **Reactive Counter** | Kris | **Last-Move Counter**: Exploits opponents that simply counter the player's previous move. |
| **Statistical Lookback** | Mrugesh | **Frequency Analysis**: Analyzes the distribution of the player's last 10 moves to predict the opponent's statistical counter. |

### Adaptive Selection Logic
The `player` function maintains a `strategy_scores` vector. After every round:
1.  The agent retrospectively calculates which of the 4 strategies would have defeated the opponent's last move.
2.  Successful strategies receive a score increment.
3.  The agent selects the strategy with the highest current score to determine the next move.
4.  This allows the agent to "learn" the opponent's identity within the first few rounds and lock into the optimal counter-strategy.

## 🚀 Performance Results

The agent was tested against 1000 rounds for each opponent. A win rate of >60% is required to pass.

| Opponent | Win Rate | Status |
| :--- | :--- | :--- |
| **Quincy** | **100.0%** | ✅ PASSED |
| **Abbey** | **87.5%** | ✅ PASSED |
| **Kris** | **100.0%** | ✅ PASSED |
| **Mrugesh** | **99.7%** | ✅ PASSED |

## 💻 Installation & Usage

### Prerequisites
- Python 3.8 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/natinew77-creator/ML-Rock-Paper-Scissors.git
cd ML-Rock-Paper-Scissors
```

### 2. Run the Simulation
Execute the main script to play against all 4 bots and verify win rates:
```bash
python3 main.py
```

### 3. Interactive Mode
To play against the bots yourself, uncomment the following line in `main.py`:
```python
# play(human, abbey, 20, verbose=True)
```

## 📂 File Structure

```
ML-Rock-Paper-Scissors/
├── RPS.py           # Core AI logic (Player function & strategies)
├── main.py          # Entry point & testing orchestration
├── RPS_game.py      # Game engine & opponent bot definitions
├── test_module.py   # Unit tests for verification
└── README.md        # Project documentation
```

## 🔗 Live Demo
<a href="https://codespaces.new/natinew77-creator/ML-Rock-Paper-Scissors">
  <img src="https://github.com/codespaces/badge.svg" alt="Open in GitHub Codespaces">
</a>

---
*Developed by Natneal B.*
<a href="https://linkedin.com/in/natneal-belete">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
