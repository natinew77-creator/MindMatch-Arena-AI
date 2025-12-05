import React, { useState, useEffect, useRef } from 'react';
import { MindMatchAI, type Move } from '../game-logic';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Activity, Terminal, User, Bot, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ai = new MindMatchAI();

type GameStatus = 'SETUP' | 'PLAYING' | 'FINISHED';

interface GameState {
    playerMove: Move | null;
    aiMove: Move | null;
    result: 'WIN' | 'LOSE' | 'TIE' | null;
    history: { game: number, winRate: number }[];
    logs: string[];
    stats: {
        wins: number;
        losses: number;
        ties: number;
        total: number;
    };
    activeStrategy: string;
    currentRound: number;
    totalRounds: number;
    status: GameStatus;
}

const GameArena: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        playerMove: null,
        aiMove: null,
        result: null,
        history: [{ game: 0, winRate: 0 }],
        logs: ['System initialized...', 'AI Neural Network online...', 'Waiting for configuration...'],
        stats: { wins: 0, losses: 0, ties: 0, total: 0 },
        activeStrategy: 'Standby',
        currentRound: 0,
        totalRounds: 10, // Default
        status: 'SETUP'
    });

    const logsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [gameState.logs]);

    const startGame = (rounds: number) => {
        ai.reset();
        setGameState({
            playerMove: null,
            aiMove: null,
            result: null,
            history: [{ game: 0, winRate: 0 }],
            logs: ['System initialized...', `Match configured for ${rounds} rounds.`, 'AI Neural Network online...', 'Waiting for player input...'],
            stats: { wins: 0, losses: 0, ties: 0, total: 0 },
            activeStrategy: 'Initializing...',
            currentRound: 1,
            totalRounds: rounds,
            status: 'PLAYING'
        });
    };

    const handleMove = (move: Move) => {
        if (gameState.status !== 'PLAYING') return;

        const { aiMove, logs, activeStrategy } = ai.play(move);

        let result: 'WIN' | 'LOSE' | 'TIE' = 'TIE';
        if (move === aiMove) result = 'TIE';
        else if (
            (move === 'R' && aiMove === 'S') ||
            (move === 'P' && aiMove === 'R') ||
            (move === 'S' && aiMove === 'P')
        ) result = 'WIN';
        else result = 'LOSE';

        setGameState(prev => {
            const newStats = { ...prev.stats, total: prev.stats.total + 1 };
            if (result === 'WIN') newStats.wins++;
            else if (result === 'LOSE') newStats.losses++;
            else newStats.ties++;

            const aiWinRate = (newStats.losses / newStats.total) * 100; // AI Win Rate (Player Loss Rate)

            // Limit logs to last 50 items
            const newLogs = [...prev.logs, `Round ${prev.currentRound}: Player chose ${move}`, ...logs, `Result: ${result === 'WIN' ? 'Player Wins' : result === 'LOSE' ? 'AI Wins' : 'Tie'}`].slice(-50);

            const isFinished = prev.currentRound >= prev.totalRounds;

            return {
                ...prev,
                playerMove: move,
                aiMove: aiMove,
                result,
                history: [...prev.history, { game: newStats.total, winRate: aiWinRate }],
                logs: newLogs,
                stats: newStats,
                activeStrategy,
                currentRound: isFinished ? prev.currentRound : prev.currentRound + 1,
                status: isFinished ? 'FINISHED' : 'PLAYING'
            };
        });
    };

    const getIcon = (move: Move | null, isPlayer: boolean) => {
        if (!move) {
            return isPlayer ?
                <User className="w-12 h-12 text-neon-green opacity-50" /> :
                <Bot className="w-12 h-12 text-neon-pink opacity-50" />;
        }
        if (move === 'R') return <div className="text-4xl">🪨</div>;
        if (move === 'P') return <div className="text-4xl">📄</div>;
        if (move === 'S') return <div className="text-4xl">✂️</div>;
    };

    const resetGame = () => {
        setGameState(prev => ({
            ...prev,
            status: 'SETUP',
            logs: ['System reset...', 'Waiting for new configuration...']
        }));
    };

    return (
        <div className="min-h-screen h-full bg-dark-bg text-neon-green p-4 flex flex-col gap-4 overflow-auto font-mono relative">
            {/* Header / Stats */}
            <header className="flex justify-between items-center border-b border-neon-green/30 pb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-8 h-8 text-neon-pink animate-pulse" />
                    <h1 className="text-2xl font-bold tracking-tighter text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                        MIND_MATCH_ARENA
                    </h1>
                </div>
                <div className="flex gap-8 text-sm items-center">
                    {gameState.status === 'PLAYING' && (
                        <div className="flex flex-col items-center">
                            <span className="text-gray-400">ROUND</span>
                            <span className="text-xl font-bold text-white">
                                {gameState.currentRound} / {gameState.totalRounds}
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400">AI WIN RATE</span>
                        <span className="text-xl font-bold text-neon-blue">
                            {gameState.stats.total > 0 ? ((gameState.stats.losses / gameState.stats.total) * 100).toFixed(1) : '0.0'}%
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400">STRATEGY</span>
                        <span className="text-neon-green animate-pulse">{gameState.activeStrategy}</span>
                    </div>
                </div>
            </header>

            {/* SETUP SCREEN */}
            <AnimatePresence>
                {gameState.status === 'SETUP' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-dark-bg/95 flex items-center justify-center"
                    >
                        <div className="bg-dark-surface border border-neon-green p-8 rounded-lg max-w-md w-full text-center shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                            <Brain className="w-16 h-16 text-neon-pink mx-auto mb-6 animate-pulse" />
                            <h2 className="text-3xl font-bold text-white mb-2">INITIALIZE MATCH</h2>
                            <p className="text-gray-400 mb-8">Select the number of rounds to calibrate the AI against your neural patterns.</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[20, 40, 60, 100].map(rounds => (
                                    <button
                                        key={rounds}
                                        onClick={() => startGame(rounds)}
                                        className="px-6 py-4 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-all rounded font-bold text-lg"
                                    >
                                        {rounds} ROUNDS
                                    </button>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-4">
                                * AI requires at least 10 rounds to build an accurate predictive model.
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GAME OVER SCREEN */}
            <AnimatePresence>
                {gameState.status === 'FINISHED' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-dark-bg/95 flex items-center justify-center"
                    >
                        <div className="bg-dark-surface border-2 border-neon-pink p-10 rounded-lg max-w-lg w-full text-center shadow-[0_0_100px_rgba(255,0,255,0.2)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-pink via-purple-500 to-neon-pink animate-pulse" />

                            {gameState.stats.wins > gameState.stats.losses ? (
                                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                            ) : gameState.stats.losses > gameState.stats.wins ? (
                                <Bot className="w-20 h-20 text-neon-pink mx-auto mb-4" />
                            ) : (
                                <AlertTriangle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            )}

                            <h2 className="text-4xl font-black text-white mb-2 italic">
                                {gameState.stats.wins > gameState.stats.losses ? 'YOU WON!' : gameState.stats.losses > gameState.stats.wins ? 'AI DOMINATION' : 'STALEMATE'}
                            </h2>

                            <p className="text-xl text-neon-blue mb-8 font-bold">
                                AI WIN RATE: {((gameState.stats.losses / gameState.stats.total) * 100).toFixed(1)}%
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
                                <div className="bg-dark-bg p-3 rounded border border-neon-green/30">
                                    <div className="text-gray-400">WINS</div>
                                    <div className="text-2xl text-neon-green font-bold">{gameState.stats.wins}</div>
                                </div>
                                <div className="bg-dark-bg p-3 rounded border border-neon-pink/30">
                                    <div className="text-gray-400">LOSSES</div>
                                    <div className="text-2xl text-neon-pink font-bold">{gameState.stats.losses}</div>
                                </div>
                                <div className="bg-dark-bg p-3 rounded border border-gray-500/30">
                                    <div className="text-gray-400">TIES</div>
                                    <div className="text-2xl text-white font-bold">{gameState.stats.ties}</div>
                                </div>
                            </div>

                            <button
                                onClick={resetGame}
                                className="w-full px-8 py-4 bg-neon-pink text-white hover:bg-pink-600 transition-all rounded font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" /> REBOOT SYSTEM
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[600px]">
                {/* Left: Player Controls */}
                <div className={`flex flex-col justify-center items-center gap-8 border border-neon-green/20 bg-dark-surface/50 p-8 rounded-lg relative overflow-hidden transition-opacity duration-500 ${gameState.status !== 'PLAYING' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50" />
                    <h2 className="text-xl font-bold mb-4">PLAYER_CONTROLS</h2>

                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button
                            onClick={() => handleMove('R')}
                            className="group relative px-6 py-4 bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg transition-all duration-300 rounded uppercase font-bold tracking-widest overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-current rounded-full group-hover:animate-ping" />
                                ROCK
                            </span>
                            <div className="absolute inset-0 bg-neon-green/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        </button>

                        <button
                            onClick={() => handleMove('P')}
                            className="group relative px-6 py-4 bg-transparent border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-all duration-300 rounded uppercase font-bold tracking-widest overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-current rounded-full group-hover:animate-ping" />
                                PAPER
                            </span>
                            <div className="absolute inset-0 bg-neon-blue/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        </button>

                        <button
                            onClick={() => handleMove('S')}
                            className="group relative px-6 py-4 bg-transparent border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-dark-bg transition-all duration-300 rounded uppercase font-bold tracking-widest overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-current rounded-full group-hover:animate-ping" />
                                SCISSORS
                            </span>
                            <div className="absolute inset-0 bg-neon-pink/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Center: Arena / Result */}
                <div className="flex flex-col gap-4">
                    {/* Battle View */}
                    <div className="flex-1 border border-neon-blue/20 bg-dark-surface/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden p-4">
                        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-10 pointer-events-none">
                            {Array.from({ length: 400 }).map((_, i) => (
                                <div key={i} className="border-[0.5px] border-neon-blue/30" />
                            ))}
                        </div>

                        <div className="flex justify-between w-full px-8 items-center z-10">
                            {/* Player Side */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm text-gray-400">YOU</span>
                                <div className={`w-24 h-24 border-2 border-neon-green rounded-full flex items-center justify-center bg-dark-bg shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 ${gameState.result === 'WIN' ? 'scale-110 border-4' : ''}`}>
                                    {getIcon(gameState.playerMove, true)}
                                </div>
                            </div>

                            {/* VS / Result */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-4xl font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    VS
                                </div>
                                {gameState.result && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        key={gameState.stats.total}
                                        className={`text-2xl font-bold px-4 py-1 rounded ${gameState.result === 'WIN' ? 'bg-neon-green text-dark-bg' :
                                            gameState.result === 'LOSE' ? 'bg-neon-pink text-white' :
                                                'bg-gray-700 text-white'
                                            }`}
                                    >
                                        {gameState.result}
                                    </motion.div>
                                )}
                            </div>

                            {/* AI Side */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm text-gray-400">AI AGENT</span>
                                <div className={`w-24 h-24 border-2 border-neon-pink rounded-full flex items-center justify-center bg-dark-bg shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all duration-300 ${gameState.result === 'LOSE' ? 'scale-110 border-4' : ''}`}>
                                    {getIcon(gameState.aiMove, false)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-48 border border-neon-blue/20 bg-dark-surface/50 rounded-lg p-2">
                        <h3 className="text-xs text-neon-blue mb-2 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> AI_PERFORMANCE_METRICS
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gameState.history}>
                                <XAxis dataKey="game" stroke="#666" fontSize={10} />
                                <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #00ffff' }}
                                    itemStyle={{ color: '#00ffff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="winRate"
                                    stroke="#ff00ff"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#39ff14' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Logs */}
                <div className="border border-neon-green/20 bg-dark-surface/50 rounded-lg p-4 flex flex-col overflow-hidden max-h-[600px]">
                    <h3 className="text-neon-green mb-2 flex items-center gap-2 border-b border-neon-green/20 pb-2">
                        <Terminal className="w-4 h-4" /> SYSTEM_LOGS
                    </h3>
                    <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 opacity-80">
                        {gameState.logs.map((log, i) => (
                            <div key={i} className="break-words">
                                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>{' '}
                                <span className={log.includes('Player') ? 'text-white' : 'text-neon-green'}>
                                    {log}
                                </span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameArena;
