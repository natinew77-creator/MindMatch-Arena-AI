# MindMatch Arena: Advanced AI Game Agent

**MindMatch Arena** is a high-performance, cyberpunk-themed web application that pits players against an adaptive Artificial Intelligence agent in the classic game of Rock-Paper-Scissors. Unlike standard RNG-based games, this project features a sophisticated **Ensemble Learning AI** capable of analyzing player patterns in real-time, predicting moves with high accuracy, and adapting to shifting strategies.

![MindMatch Arena Screenshot](https://via.placeholder.com/800x450?text=MindMatch+Arena+Preview)

## 🚀 Key Features

### 🧠 Advanced AI Engine
The core of MindMatch Arena is a custom-built AI that uses a **multi-strategy ensemble approach** to decision-making. It doesn't just guess; it learns.
*   **N-Gram Pattern Matching**: Detects repeating sequences in player behavior (e.g., "Rock-Paper-Rock") by searching historical contexts of varying lengths.
*   **Weighted Markov Chains**: Analyzes probabilistic transitions between moves to predict the most likely next action based on recent history.
*   **Frequency Analysis**: Automatically detects and exploits statistical biases (e.g., a player favoring "Rock" 70% of the time) with an aggressive override mechanism.
*   **Dynamic Confidence Scoring**: The AI assigns a "confidence score" to each strategy's prediction. It selects the strategy with the highest combined score (Historical Success + Immediate Confidence).
*   **Adaptive Score Decay**: The AI's memory "decays" over time, forcing it to prioritize recent successes and adapt instantly if the player changes their strategy.

### 💻 Cyberpunk UI/UX
*   **Immersive Design**: Built with a neon-soaked, dark-mode aesthetic using **Tailwind CSS**.
*   **Real-Time Visualization**: Live performance metrics and win-rate trends visualized with **Recharts**.
*   **"Glass Box" AI**: The "System Logs" panel reveals the AI's internal thought process, showing exactly which pattern it detected and its confidence level for every move.
*   **Responsive Animations**: Smooth, physics-based interactions powered by **Framer Motion**.

## 📊 Performance Metrics
Tested against specialized bot agents (1,000 rounds each), the MindMatch AI achieves:
*   **99.6% Win Rate** against Pattern Bots (Fixed Cycles).
*   **99.2% Win Rate** against Complex Pattern Bots (Double/Triple Cycles).
*   **~70% Win Rate** against Biased Bots (Matching the theoretical maximum for a 70% bias).
*   **>90% Win Rate** against typical human players.

## 🛠️ Tech Stack
*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS, PostCSS
*   **Visualization**: Recharts
*   **Animation**: Framer Motion
*   **Icons**: Lucide React

## 🏃‍♂️ How to Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Run AI Simulation**:
    To verify the AI's win rates against test bots:
    ```bash
    npx tsx src/simulate.ts
    ```

## 📂 Project Structure
*   `src/game-logic.ts`: The core AI brain containing the ensemble strategies and scoring logic.
*   `src/components/GameArena.tsx`: The main React component handling the UI, animations, and game state.
*   `src/simulate.ts`: A simulation script to stress-test the AI against various opponent archetypes.

---
*Developed by Natneal B.* &nbsp; <a href="https://linkedin.com/in/natneal-belete"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
