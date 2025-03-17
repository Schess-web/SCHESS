console.log("JavaScript is running!");

// Board Setup (Important: No longer using Chessboard.js)
const board = document.querySelector('.chess-board');
const squares = [];
let selectedPiece = null; // Keep track of the selected piece
let pieces = {}; // Store piece positions

const initialBoardState = [
    'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
    'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
    'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'
];

// Function to convert 1D array index to chess coordinate
function indexToCoordinate(index) {
    const row = 8 - Math.floor(index / 8);
    const col = String.fromCharCode(97 + (index % 8));
    return col + row;
}

// Function to convert chess coordinate to 1D array index
function coordinateToIndex(coordinate) {
    const col = coordinate.charCodeAt(0) - 97; // 'a' is 97
    const row = 8 - parseInt(coordinate.charAt(1));
    return row * 8 + col;
}
function createBoard() {
    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = i; // Store the index
        square.id = indexToCoordinate(i); // set the square id

        if ((Math.floor(i / 8) + (i % 8)) % 2 === 0) {
            square.classList.add('light');
        } else {
            square.classList.add('dark');
        }

        square.addEventListener('click', handleSquareClick); // click event
        board.appendChild(square);
        squares.push(square); // Store the square element

        // Add piece, if any
        if (initialBoardState[i]) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.dataset.piece = initialBoardState[i];
            piece.draggable = true; // Make draggable
            square.appendChild(piece); // Add piece to the square
            pieces[indexToCoordinate(i)] = initialBoardState[i]; // Update piece position
            piece.addEventListener('dragstart', handleDragStart);
            square.addEventListener('dragover', allowDrop);
            square.addEventListener('drop', handleDrop);
        }
    }
}

function handleDragStart(event){
    selectedPiece = event.target;
    console.log("Drag start");
}

function allowDrop(event){
    event.preventDefault();
}

function handleDrop(event){
    event.preventDefault();
    const targetSquare = event.currentTarget;

    if (targetSquare && selectedPiece) {
        const sourceSquare = selectedPiece.parentNode;
        const sourceIndex = sourceSquare.dataset.index;
        const targetIndex = targetSquare.dataset.index;
        const sourceCoordinate = indexToCoordinate(sourceIndex);
        const targetCoordinate = indexToCoordinate(targetIndex);
        // Validation function called here!
        if(isValidMove(sourceCoordinate, targetCoordinate)){
            // Move Piece
            targetSquare.appendChild(selectedPiece);
            pieces[targetCoordinate] = selectedPiece.dataset.piece;
            delete pieces[sourceCoordinate];
            // Clear Selected Piece
            selectedPiece = null;
        }
    }
}

function isValidMove(source, target) {
    const piece = pieces[source];
    const targetPiece = pieces[target];
    const sourceIndex = coordinateToIndex(source);
    const targetIndex = coordinateToIndex(target);

    if (piece === null) return false; // No piece
    if (piece.charAt(0) === targetPiece?.charAt(0)) return false; // Capture same piece

    // Dummy movement logic for demonstration
    const rowDiff = Math.abs(Math.floor(sourceIndex / 8) - Math.floor(targetIndex / 8));
    const colDiff = Math.abs(sourceIndex % 8 - targetIndex % 8);

    // All pieces can move one square, for demonstration
    return (rowDiff <= 1 && colDiff <= 1);

}

function handleSquareClick(event) {
    const square = event.target;
    console.log(`Clicked square: ${square.id}`);
}

function startPosition(){
    selectedPiece = null;
    pieces = {};
    squares.forEach((square, i) => {
        while (square.firstChild) {
            square.removeChild(square.firstChild);
        }
        // Add piece, if any
        if (initialBoardState[i]) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.dataset.piece = initialBoardState[i];
            piece.draggable = true; // Make draggable
            square.appendChild(piece); // Add piece to the square
            pieces[indexToCoordinate(i)] = initialBoardState[i]; // Update piece position
            piece.addEventListener('dragstart', handleDragStart);
            square.addEventListener('dragover', allowDrop);
            square.addEventListener('drop', handleDrop);
        }
    });
}

createBoard();

const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', startPosition);
