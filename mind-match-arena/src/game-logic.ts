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

        this.strategyScores = this.strategyScores.map(s => s * 0.8); // Aggressive decay (0.9 -> 0.8) to drop losers fast

        this.currentPredictions.forEach((predictedMove, index) => {
            if (predictedMove === playerMove) {
                this.strategyScores[index] += 5; // Huge reward (3 -> 5)
            } else {
                this.strategyScores[index] -= 2; // Punish wrong guesses hard
            }
        });

        // 3. Generate Predictions for the NEXT turn & Calculate Confidence

        // --- Strategy 1: Pattern Hunter (Opponent Only) ---
        let strat1Prediction: Move = 'R';
        let strat1Confidence = 0;
        if (this.opponentHistory.length > 0) { // Check immediately
            const maxSearchLen = Math.min(this.opponentHistory.length - 1, 10);
            let foundPattern = false;
            for (let len = maxSearchLen; len >= 1; len--) {
                const currentPattern = this.opponentHistory.slice(-len).join('');
                const historyStr = this.opponentHistory.slice(0, -1).join('');
                const lastIndex = historyStr.lastIndexOf(currentPattern);
                if (lastIndex !== -1 && lastIndex + len < historyStr.length) {
                    strat1Prediction = historyStr[lastIndex + len] as Move;
                    // Exponential confidence boost for longer patterns
                    strat1Confidence = Math.pow(len, 1.5) * 20;
                    foundPattern = true;
                    break;
                }
            }
            if (!foundPattern) strat1Prediction = this.randomMove();
        }

        // --- Strategy 2: Pattern Hunter (Full Context: My Move + Their Move) ---
        let strat2Prediction: Move = 'P';
        let strat2Confidence = 0;
        if (this.opponentHistory.length > 0 && this.myHistory.length > 0) {
            const combinedHistory = this.opponentHistory.map((m, i) => m + (this.myHistory[i] || ''));
            const maxSearchLen = Math.min(combinedHistory.length - 1, 8);
            let foundPattern = false;

            for (let len = maxSearchLen; len >= 1; len--) {
                const suffix = combinedHistory.slice(-len);
                for (let i = combinedHistory.length - 2 - len; i >= 0; i--) {
                    const slice = combinedHistory.slice(i, i + len);
                    if (slice.every((val, idx) => val === suffix[idx])) {
                        const nextMove = this.opponentHistory[i + len];
                        strat2Prediction = nextMove;
                        strat2Confidence = Math.pow(len, 1.5) * 25; // Even higher confidence for context matches
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
        let strat3Confidence = 1;
        if (this.opponentHistory.length > 0) {
            const lastMove = this.opponentHistory[this.opponentHistory.length - 1];
            const counts = { 'R': 0, 'P': 0, 'S': 0 };
            for (let i = 0; i < this.opponentHistory.length - 1; i++) {
                if (this.opponentHistory[i] === lastMove) {
                    const next = this.opponentHistory[i + 1];
                    const weight = Math.pow(1.2, i); // Steeper weight
                    counts[next] += weight;
                }
            }
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            if (total > 0) {
                const mostLikely = Object.keys(counts).reduce((a, b) => counts[a as Move] > counts[b as Move] ? a : b) as Move;
                strat3Prediction = mostLikely;
                const probability = counts[mostLikely] / total;
                strat3Confidence = probability * 10;
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
        let strat5Prediction: Move = 'P';
        let strat5Confidence = 0;
        if (this.opponentHistory.length >= 3) {
            const counts = { 'R': 0, 'P': 0, 'S': 0 };
            this.opponentHistory.forEach(m => counts[m]++);
            const total = this.opponentHistory.length;

            // Sort counts to check for dominance
            const sortedCounts = Object.entries(counts).sort(([, a], [, b]) => b - a);
            const [firstMove, firstCount] = sortedCounts[0];
            const [, secondCount] = sortedCounts[1];

            const mostFrequent = firstMove as Move;
            const frequency = firstCount / total;
            const margin = (firstCount - secondCount) / total;

            // Only use frequency if there is a clear winner (margin > 10%)
            // This prevents it from guessing randomly when R=50%, P=50%
            if (margin > 0.1) {
                if (frequency > 0.6) {
                    strat5Prediction = mostFrequent;
                    strat5Confidence = 2000; // SUPER NUCLEAR
                } else if (frequency > 0.4) {
                    strat5Prediction = mostFrequent;
                    strat5Confidence = (frequency - 0.3) * 15;
                }
            }
        }

        // --- SPECIAL: INSTANT REPETITION & ALTERNATING LOCK ---

        // 1. Instant Repetition (R, R -> R)
        if (this.opponentHistory.length >= 2) {
            const last = this.opponentHistory[this.opponentHistory.length - 1];
            const secondLast = this.opponentHistory[this.opponentHistory.length - 2];
            if (last === secondLast) {
                strat1Prediction = last;
                strat1Confidence = 5000; // Absolute priority
            }
        }

        // 2. Alternating Lock (R, P, R -> P)
        if (this.opponentHistory.length >= 3) {
            const last = this.opponentHistory[this.opponentHistory.length - 1];
            const last2 = this.opponentHistory[this.opponentHistory.length - 2];
            const last3 = this.opponentHistory[this.opponentHistory.length - 3];

            if (last === last3 && last !== last2) {
                // Pattern is A, B, A... predict B
                strat1Prediction = last2;
                strat1Confidence = 4000; // High priority (Alternating)
            }
        }

        // 3. Early Game Guess (R, P -> R?)
        // If we only have 2 moves and they are different, guess it's an alternating pattern
        if (this.opponentHistory.length === 2) {
            const last = this.opponentHistory[this.opponentHistory.length - 1];
            const secondLast = this.opponentHistory[this.opponentHistory.length - 2];
            if (last !== secondLast) {
                strat1Prediction = secondLast; // Guess they will go back to the first move
                strat1Confidence = 50; // Moderate boost to tip the scales early
            }
        }

        this.currentPredictions = [strat1Prediction, strat2Prediction, strat3Prediction, strat4Prediction, strat5Prediction];
        const confidences = [strat1Confidence, strat2Confidence, strat3Confidence, strat4Confidence, strat5Confidence];

        // 4. Select Best Strategy
        const combinedScores = this.strategyScores.map((score, i) => score + confidences[i]);

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
