export type Move = 'R' | 'P' | 'S';

export interface GameStats {
    wins: number;
    losses: number;
    ties: number;
    totalGames: number;
    winRate: number; // AI Win Rate
    confidence: number; // Based on strategy score
}

export class MindMatchAI {
    private opponentHistory: Move[];
    private myHistory: Move[];
    private strategyScores: number[];

    private nextAIMove: Move;
    private currentPredictions: Move[]; // Predictions for the CURRENT turn (to be verified)

    private idealResponse: Record<Move, Move> = {
        'P': 'S',
        'R': 'P',
        'S': 'R'
    };

    constructor() {
        this.opponentHistory = [];
        this.myHistory = [];
        this.strategyScores = [0, 0, 0, 0, 0]; // 5 Strategies
        this.currentPredictions = ['R', 'R', 'R', 'R', 'R'];
        this.nextAIMove = this.randomMove();
    }

    reset() {
        this.opponentHistory = [];
        this.myHistory = [];
        this.strategyScores = [0, 0, 0, 0, 0];
        // Initial random predictions/move
        this.currentPredictions = ['R', 'R', 'R', 'R', 'R'];
        this.nextAIMove = this.randomMove();
    }

    private randomMove(): Move {
        return ['R', 'P', 'S'][Math.floor(Math.random() * 3)] as Move;
    }

    getAIMove(): Move {
        return this.nextAIMove;
    }

    // Called after player selects a move
    play(playerMove: Move): {
        aiMove: Move,
        logs: string[],
        activeStrategy: string
    } {
        const logs: string[] = [];
        const playedAIMove = this.nextAIMove;

        // 1. Update Opponent History
        this.opponentHistory.push(playerMove);
        this.myHistory.push(playedAIMove);

        // 2. Update Scores with DECAY
        // Ensure we have 5 scores
        while (this.strategyScores.length < 5) this.strategyScores.push(0);

        this.strategyScores = this.strategyScores.map(s => s * 0.95); // Slower decay (0.9 -> 0.95) to keep good strategies active longer

        this.currentPredictions.forEach((predictedMove, index) => {
            if (predictedMove === playerMove) {
                this.strategyScores[index] += 1;
            } else {
                this.strategyScores[index] -= 0.5;
            }
        });

        // 3. Generate Predictions for the NEXT turn & Calculate Confidence

        // --- Strategy 1: Pattern Hunter (Opponent Only) ---
        let strat1Prediction: Move = 'R';
        let strat1Confidence = 0;
        if (this.opponentHistory.length > 3) {
            const maxSearchLen = Math.min(this.opponentHistory.length - 1, 10);
            let foundPattern = false;
            for (let len = maxSearchLen; len >= 3; len--) {
                const currentPattern = this.opponentHistory.slice(-len).join('');
                const historyStr = this.opponentHistory.slice(0, -1).join('');
                const lastIndex = historyStr.lastIndexOf(currentPattern);
                if (lastIndex !== -1 && lastIndex + len < historyStr.length) {
                    strat1Prediction = historyStr[lastIndex + len] as Move;
                    strat1Confidence = len * 2; // High confidence for long patterns
                    foundPattern = true;
                    break;
                }
            }
            if (!foundPattern) strat1Prediction = this.randomMove();
        }

        // --- Strategy 2: Pattern Hunter (Full Context: My Move + Their Move) ---
        let strat2Prediction: Move = 'P';
        let strat2Confidence = 0;
        if (this.opponentHistory.length > 3 && this.myHistory.length > 3) {
            const combinedHistory = this.opponentHistory.map((m, i) => m + (this.myHistory[i] || ''));
            const maxSearchLen = Math.min(combinedHistory.length - 1, 8);
            let foundPattern = false;

            for (let len = maxSearchLen; len >= 2; len--) {
                const currentPattern = combinedHistory.slice(-len).join('|');
                const historyStr = combinedHistory.slice(0, -1).join('|');
                const lastIndex = historyStr.lastIndexOf(currentPattern);

                // Re-verify match in array to be safe
                const suffix = combinedHistory.slice(-len);
                for (let i = combinedHistory.length - 2 - len; i >= 0; i--) {
                    const slice = combinedHistory.slice(i, i + len);
                    if (slice.every((val, idx) => val === suffix[idx])) {
                        const nextMove = this.opponentHistory[i + len];
                        strat2Prediction = nextMove;
                        strat2Confidence = len * 2.5; // Higher confidence for context matches
                        foundPattern = true;
                        break;
                    }
                }
                if (foundPattern) break;
            }
            if (!foundPattern) strat2Prediction = this.randomMove();
        }

        // --- Strategy 3: Markov Chain (Weighted) ---
        let strat3Prediction: Move = 'S';
        let strat3Confidence = 1; // Base confidence
        if (this.opponentHistory.length > 0) {
            const lastMove = this.opponentHistory[this.opponentHistory.length - 1];
            const counts = { 'R': 0, 'P': 0, 'S': 0 };
            // Give more weight to recent history
            for (let i = 0; i < this.opponentHistory.length - 1; i++) {
                if (this.opponentHistory[i] === lastMove) {
                    const next = this.opponentHistory[i + 1];
                    const weight = Math.pow(1.05, i);
                    counts[next] += weight;
                }
            }
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            if (total > 0) {
                const mostLikely = Object.keys(counts).reduce((a, b) => counts[a as Move] > counts[b as Move] ? a : b) as Move;
                strat3Prediction = mostLikely;

                // Confidence Calculation Upgrade:
                // If one move is overwhelmingly likely (>60%), boost confidence significantly
                const probability = counts[mostLikely] / total;
                strat3Confidence = probability * 5; // Boosted multiplier
            }
        }

        // --- Strategy 4: Anti-Repetition (Gambler's Fallacy) ---
        let strat4Prediction: Move = 'R';
        let strat4Confidence = 0.5;
        if (this.myHistory.length > 0) {
            const myLast = this.myHistory[this.myHistory.length - 1] as Move;
            strat4Prediction = this.idealResponse[myLast];
        }

        // --- Strategy 5: Frequency Counter (New) ---
        // If they play Rock 70% of the time, just play Paper.
        let strat5Prediction: Move = 'P';
        let strat5Confidence = 0;
        if (this.opponentHistory.length > 10) {
            const counts = { 'R': 0, 'P': 0, 'S': 0 };
            this.opponentHistory.forEach(m => counts[m]++);
            const total = this.opponentHistory.length;
            const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a as Move] > counts[b as Move] ? a : b) as Move;
            const frequency = counts[mostFrequent] / total;

            if (frequency > 0.5) {
                // CRITICAL: If bias is > 50%, we MUST play the counter 100% of the time.
                // Any deviation is statistically suboptimal.
                strat5Prediction = mostFrequent;
                strat5Confidence = 1000; // Nuclear option: Override all other strategies
            } else if (frequency > 0.4) {
                strat5Prediction = mostFrequent;
                strat5Confidence = (frequency - 0.3) * 10;
            }
        }

        this.currentPredictions = [strat1Prediction, strat2Prediction, strat3Prediction, strat4Prediction, strat5Prediction];
        const confidences = [strat1Confidence, strat2Confidence, strat3Confidence, strat4Confidence, strat5Confidence];

        // 4. Select Best Strategy
        const combinedScores = this.strategyScores.map((score, i) => score + confidences[i]);

        // Select the strategy with the highest combined score (History + Current Confidence)
        // This correctly handles the '1000' confidence override from Strategy 5
        const bestStrategyIndex = combinedScores.indexOf(Math.max(...combinedScores));

        const finalPrediction = this.currentPredictions[bestStrategyIndex];

        // 5. Determine NEXT AI Move
        this.nextAIMove = this.idealResponse[finalPrediction];

        // Logs
        const strategyNames = ['Pattern Hunter (Simple)', 'Pattern Hunter (Context)', 'Weighted Markov', 'Counter-Reflex', 'Frequency Analysis'];
        logs.push(`AI detected pattern: ${strategyNames[bestStrategyIndex]}`);
        logs.push(`AI Confidence: ${Math.min(this.strategyScores[bestStrategyIndex] * 5, 100)}%`);
        logs.push(`Predicting Player will play: ${finalPrediction}`);

        return {
            aiMove: playedAIMove,
            logs,
            activeStrategy: strategyNames[bestStrategyIndex]
        };
    }
}
