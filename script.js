console.log("JavaScript is running!");

let board = null;
const game = new Chess();
let $status = $('#status');


function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.startsWith('b')) ||
        (game.turn() === 'b' && piece.startsWith('w'))) {
        return false
    }
}

function onDrop (source, target) {
    // see if the move is legal
    let move = null;
    try {
        move = game.move({
            from: source,
            to: target,
            promotion: 'q' // always promote to a queen for example simplicity
        });
    } catch (error) {
        console.error("Invalid move:", error);
        return 'snapback';
    }


    // illegal move
    if (move === null) return 'snapback'

    updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

function updateStatus () {
    let status = ''

    let moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
}

const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

board = Chessboard('board', config);

updateStatus();

$( "#startBtn" ).click(function() {
    game.reset();
    board.start();
    updateStatus();
});

$( "#clearBtn" ).click(function() {
    game.reset();
    board.clear();
    updateStatus();
});
