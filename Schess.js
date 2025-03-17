console.log("JavaScript is running!");

        const chess = new Chess();

        const board = Chessboard('board', {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        });

        function onDragStart(source, piece, position, orientation) {
            if (chess.game_over() || 
                (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        }

        function onDrop(source, target) {
            const move = chess.move({
                from: source,
                to: target,
                promotion: 'q'
            });

            if (move === null) return 'snapback';

            updateStatus();
        }

        function onSnapEnd() {
            board.position(chess.fen());
        }

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

            document.getElementById('status').textContent = status;
        }

        document.getElementById('startBtn').addEventListener('click', () => {
            chess.reset();
            board.start();
            updateStatus();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            chess.clear();
            board.clear();
            updateStatus();
        });
 
        updateStatus();
