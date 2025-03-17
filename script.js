console.log("JavaScript is running!");

// Initialize chess.js
const chess = new Chess();

// Initialize chessboard.js
const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});

// Handle drag start event
function onDragStart(source, piece, position, orientation) {
    // Prevent dragging if the game is over or if it's not the player's turn
    if (chess.game_over() || 
        (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

// Handle drop event
function onDrop(source, target) {
    // Attempt to make a move
    const move = chess.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    });

    // If the move is illegal, return the piece to its original square
    if (move === null) return 'snapback';

    updateStatus();
}

// Update the board position after a valid move
function onSnapEnd() {
    board.position(chess.fen());
}

// Update game status (e.g., whose turn it is, checkmate, etc.)
function updateStatus() {
    let status = '';

    let moveColor = 'White';
    if (chess.turn() === 'b') {
        moveColor = 'Black';
    }

    if (chess.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (chess.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        status = moveColor + ' to move';
        if (chess.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    console.log(status); // Log the status to the console for debugging
}

// Event listener for the "Start Position" button
document.getElementById('startBtn').addEventListener('click', () => {
    chess.reset();
    board.start();
});

// Event listener for the "Clear Board" button
document.getElementById('clearBtn').addEventListener('click', () => {
    chess.clear();
    board.clear();
});

// Initialize game status
updateStatus();
