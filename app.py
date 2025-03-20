from flask import Flask, render_template, request

app = Flask(__name__)

# Route to serve the HTML file
@app.route('/')
def index():
    return render_template('index.html')  # This assumes index.html is in a "templates" folder

# Route to handle form submission
@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
    return f'<h1>Hello, {name}! Your form has been submitted successfully.</h1>'

if __name__ == '__main__':
    app.run(debug=True)

import chess
import chess.engine
import random

class ChessAI:
    def __init__(self, mode='easy'):
        self.board = chess.Board()
        self.mode = mode
        self.engine = chess.engine.SimpleEngine.popen_uci("/path/to/stockfish")  # path to your Stockfish binary

    def get_move(self):
        if self.mode == 'easy':
            return self.easy_move()
        elif self.mode == 'medium':
            return self.medium_move()
        elif self.mode == 'hard':
            return self.hard_move()

    def easy_move(self):
        legal_moves = list(self.board.legal_moves)
        return random.choice(legal_moves)

    def medium_move(self):
        best_move = None
        best_eval = -float('inf')

        for move in self.board.legal_moves:
            self.board.push(move)
            eval = self.evaluate_board()
            self.board.pop()

            if eval > best_eval:
                best_eval = eval
                best_move = move

        return best_move if best_move is not None else random.choice(list(self.board.legal_moves))

    def hard_move(self):
        result = self.engine.play(self.board, chess.engine.Limit(time=2.0))  # Adjust time according to your preference
        return result.move

    def evaluate_board(self):
        # Example simplistic evaluation function
        material_values = {
            chess.PAWN: 1,
            chess.KNIGHT: 3,
            chess.BISHOP: 3,
            chess.ROOK: 5,
            chess.QUEEN: 9,
            chess.KING: 0
        }
        eval = 0
        for piece_type in material_values:
            eval += len(self.board.pieces(piece_type, chess.WHITE)) * material_values[piece_type]
            eval -= len(self.board.pieces(piece_type, chess.BLACK)) * material_values[piece_type]
        return eval

    def play(self):
        while not self.board.is_game_over():
            print(self.board)
            if self.board.turn == chess.WHITE:
                print("Your turn. Enter your move in UCI format (e.g., e2e4): ")
                user_move = input()
                try:
                    move = chess.Move.from_uci(user_move)
                    if move in self.board.legal_moves:
                        self.board.push(move)
                    else:
                        print("Illegal move, try again.")
                        continue
                except ValueError:
                    print("Invalid input format, please enter a valid move.")
                    continue
            else:
                print("AI is thinking...")
                ai_move = self.get_move()
                self.board.push(ai_move)
                print(f"AI moves: {ai_move}")

        print("Game Over!")
        print(f"Result: {self.board.result()}")
        self.engine.quit()

if __name__ == "__main__":
    mode = input("Select difficulty (easy, medium, hard): ")
    ai = ChessAI(mode)
    ai.play()

