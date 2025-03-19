let board,
    game = new Chess(),
    difficulty = 'easy';

const onDragStart = (source, piece, position, orientation) => {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

const makeBestMove = () => {
    let bestMove;
    
    if (difficulty === 'easy') {
        bestMove = easyMove();
    } else if (difficulty === 'medium') {
        bestMove = mediumMove();
    } else if (difficulty === 'hard') {
        bestMove = hardMove();
    }

    if (bestMove) {
        game.move(bestMove);
        renderMove(bestMove);
    }

    if (game.game_over()) {
        alert('Game Over!');
    }
};

const easyMove = () => {
    const legalMoves = game.legal_moves();
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};

const mediumMove = () => {
    let bestMove = null;
    let bestValue = -9999;

    game.legal_moves().forEach(move => {
        game.move(move);
        const boardValue = evaluateBoard();
        game.undo();

        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    });

    return bestMove;
};

const hardMove = () => {
    const availableMoves = game.legal_moves();
    let bestMove = availableMoves[0];
    let bestValue = -9999;

    availableMoves.forEach(move => {
        game.move(move);
        const value = minimax(game, 3, false);
        game.undo();

        if (value > bestValue) {
            bestValue = value;
            bestMove = move;
        }
    });

    return bestMove;
};

const minimax = (game, depth, isMaximizing) => {
    if (depth === 0) {
        return evaluateBoard();
    }

    const legalMoves = game.legal_moves();

    if (isMaximizing) {
        let bestValue = -9999;
        legalMoves.forEach(move => {
            game.move(move);
            bestValue = Math.max(bestValue, minimax(game, depth - 1, false));
            game.undo();
        });
        return bestValue;
    } else {
        let bestValue = 9999;
        legalMoves.forEach(move => {
            game.move(move);
            bestValue = Math.min(bestValue, minimax(game, depth - 1, true));
            game.undo();
        });
        return bestValue;
    }
};

const evaluateBoard = () => {
    let totalEvaluation = 0;

    const pieceValue = {
        'p': 1,
        'n': 3,
        'b': 3,
        'r': 5,
        'q': 9,
        'k': 1000
    };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = game.board()[row][col];
            if (piece) {
                totalEvaluation += piece.color === 'w' ? pieceValue[piece.type] : -pieceValue[piece.type];
            }
        }
    }

    return totalEvaluation;
};

const renderMove = move => {
    board.move(move);
    renderBoard();
};

const renderBoard = () => {
    board.position(game.fen());
};

const onSnapEnd = () => {
    renderBoard();
    if (!game.game_over()) {
        makeBestMove();
    }
};

const init = () => {
    board = ChessBoard('board', {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onSnapEnd,
        onSnapEnd: onSnapEnd
    });

    document.getElementById('startBtn').onclick = () => {
        difficulty = document.getElementById('difficulty').value;
        game.reset();
        renderBoard();
    };
};

window.onload = init;
