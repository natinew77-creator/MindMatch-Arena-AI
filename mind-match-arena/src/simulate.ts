import { MindMatchAI, Move } from './game-logic';

const ai = new MindMatchAI();

function playRound(playerMove: Move): 'WIN' | 'LOSE' | 'TIE' {
    const { aiMove } = ai.play(playerMove);
    if (aiMove === playerMove) return 'TIE';
    if (
        (aiMove === 'R' && playerMove === 'S') ||
        (aiMove === 'P' && playerMove === 'R') ||
        (aiMove === 'S' && playerMove === 'P')
    ) return 'WIN'; // AI Wins
    return 'LOSE'; // AI Loses
}

function runSimulation(name: string, getMove: (i: number, lastAIMove: Move) => Move, rounds: number = 1000) {
    ai.reset();
    let wins = 0;
    let losses = 0;
    let ties = 0;
    let lastAIMove: Move = 'R'; // Initial dummy

    for (let i = 0; i < rounds; i++) {
        const playerMove = getMove(i, lastAIMove);
        const result = playRound(playerMove);
        if (result === 'WIN') wins++;
        if (result === 'LOSE') losses++;
        if (result === 'TIE') ties++;

        // We need to peek at what the AI *actually* played to feed it to the "Reactionary" bot
        // But playRound abstracts it. For simulation, it's fine.
    }

    const winRate = (wins / rounds) * 100;
    console.log(`[${name}] Results after ${rounds} rounds:`);
    console.log(`AI Wins: ${wins} (${winRate.toFixed(1)}%)`);
    console.log(`AI Losses: ${losses}`);
    console.log(`Ties: ${ties}`);
    console.log('-----------------------------------');
    return winRate;
}

console.log('Starting AI Win Rate Simulation...\n');

// 1. Strict Pattern Bot (R-P-S-R-P-S...)
const patternBot = (i: number) => ['R', 'P', 'S'][i % 3] as Move;
runSimulation('Pattern Bot (R-P-S Cycle)', patternBot);

// 2. Biased Bot (70% Rock, 15% Paper, 15% Scissors)
const biasedBot = () => {
    const r = Math.random();
    if (r < 0.7) return 'R';
    if (r < 0.85) return 'P';
    return 'S';
};
runSimulation('Biased Bot (Heavy Rock)', biasedBot);

// 3. Double Pattern Bot (RR-PP-SS...)
const doubleBot = (i: number) => {
    const idx = Math.floor(i / 2) % 3;
    return ['R', 'P', 'S'][idx] as Move;
};
runSimulation('Double Pattern Bot (RR-PP-SS)', doubleBot);

// 4. Random Bot (Control Group)
const randomBot = () => ['R', 'P', 'S'][Math.floor(Math.random() * 3)] as Move;
runSimulation('Random Bot (Control)', randomBot);
