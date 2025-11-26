# The player function uses a Markov Chain strategy to beat the 4 bots
# It tracks patterns of length 5 to predict the next move

def player(prev_play, opponent_history=[], play_order={}):
    # 0. RESET history if it's a new game (prev_play is empty string)
    if prev_play == "":
        opponent_history.clear()
        play_order.clear()
    
    # 1. Update history with the opponent's last move
    if prev_play != "":
        opponent_history.append(prev_play)
    
     
    n = 5
    
    # 3. Learn from history
    if len(opponent_history) > n:
        last_pattern = "".join(opponent_history[-(n+1):-1])
        last_move = opponent_history[-1]
        
        if last_pattern not in play_order:
            play_order[last_pattern] = {}
        
        if last_move not in play_order[last_pattern]:
            play_order[last_pattern][last_move] = 0
        
        play_order[last_pattern][last_move] += 1

    # 4. Predict the NEXT move
    prediction = "P" # Default
    
    if len(opponent_history) >= n:
        current_pattern = "".join(opponent_history[-n:])

        if current_pattern in play_order:
            potential_moves = play_order[current_pattern]
            prediction = max(potential_moves, key=potential_moves.get)

    # 5. Counter the prediction
    ideal_response = {'P': 'S', 'R': 'P', 'S': 'R'}
    return ideal_response[prediction]
