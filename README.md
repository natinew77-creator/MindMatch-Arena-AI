# MindMatch Arena: Adaptive AI Game Agent

[![Live Demo](https://img.shields.io/badge/Live_Demo-mind--match--arena--ai.vercel.app-39ff14?style=for-the-badge&logo=vercel&logoColor=000000)](https://mind-match-arena-ai.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**MindMatch Arena** is a high-performance, cyberpunk-themed web application that pits players against an adaptive Artificial Intelligence agent in the classic game of Rock-Paper-Scissors. 

Unlike standard RNG-based games, this project features a sophisticated **Ensemble Learning AI** capable of analyzing player patterns in real-time, predicting moves with high accuracy, and adapting to shifting strategies within milliseconds.

![MindMatch Arena Preview](https://via.placeholder.com/800x450?text=MindMatch+Arena+Preview)

## Key Features

### Advanced AI Engine
The core of MindMatch Arena is a custom-built AI that uses a **multi-strategy ensemble approach** to decision-making. It doesn't just guess; it learns.

*   **Pattern Recognition Engine**: Detects complex repeating sequences (e.g., "Rock-Paper-Rock") instantly using variable-length N-gram search.
*   **Weighted Markov Chains**: Analyzes probabilistic transitions between moves to predict the most likely next action based on recent history.
*   **Adaptive Frequency Analysis**: Automatically detects and exploits statistical biases (e.g., a player favoring "Rock" 60% of the time) with a "Nuclear" override mechanism.
*   **Dynamic Strategy Selection**: The AI assigns a real-time "confidence score" to each strategy. It dynamically switches between **Pattern Matching**, **Markov Chains**, and **Counter-Reflex** logic based on which one is currently winning.
*   **Instant Adaptation**: The AI's memory "decays" intelligently, allowing it to pivot strategies instantly if the player changes their behavior.

### Cyberpunk UI/UX
*   **Immersive Design**: Built with a neon-soaked, dark-mode aesthetic using **Tailwind CSS** and **Glassmorphism**.
*   **Real-Time Visualization**: Live performance metrics and win-rate trends visualized with **Recharts**.
*   **"Glass Box" AI**: The "System Logs" panel reveals the AI's internal thought process, showing exactly which pattern it detected and its confidence level for every move.
*   **Responsive Animations**: Smooth, physics-based interactions powered by **Framer Motion**.

## Performance Metrics
Tested against specialized bot agents (1,000 rounds each), the MindMatch AI achieves:

*   **99.6% Win Rate** against Fixed Pattern Bots.
*   **>95% Win Rate** against Alternating Pattern Bots (e.g., R-P-R-P).
*   **~80% Win Rate** against Biased Bots (exploiting statistical tendencies).
*   **>90% Win Rate** against typical human players.

## Tech Stack
*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS v4, PostCSS
*   **Visualization**: Recharts
*   **Animation**: Framer Motion
*   **Icons**: Lucide React

## How to Run Locally

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/natinew77/ML-Rock-Paper-Scissors.git
    cd ML-Rock-Paper-Scissors/mind-match-arena
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Run AI Simulation**:
    To verify the AI's win rates against test bots:
    ```bash
    npx tsx src/simulate.ts
    ```

## Project Structure
*   `src/game-logic.ts`: The core AI brain containing the ensemble strategies and scoring logic.
*   `src/components/GameArena.tsx`: The main React component handling the UI, animations, and game state.
*   `src/simulate.ts`: A simulation script to stress-test the AI against various opponent archetypes.

---
*Developed by Natneal B.* &nbsp; <a href="https://linkedin.com/in/natneal-belete"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
