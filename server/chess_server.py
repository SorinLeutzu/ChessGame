from flask import Flask, request, jsonify
import psycopg2
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)



def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="",
        dbname="forchessdb"
    )



def get_valid_moves(piece, row, col, board):
    moves = []
    rows, cols = len(board), len(board[0])

    directions = {
        "pawn": [(1, 0), (1, 1), (1, -1)], 
        "rook": [(1, 0), (-1, 0), (0, 1), (0, -1)],
        "bishop": [(1, 1), (1, -1), (-1, 1), (-1, -1)],
        "queen": [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)],
        "knight": [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)],
        "king": [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
    }

    if piece.lower() in directions:
        for dr, dc in directions[piece.lower()]:
            r, c = row + dr, col + dc
            while 0 <= r < rows and 0 <= c < cols:
                if board[r][c] == "":  
                    moves.append({"row": r, "col": c})
                else:
                    break  

                if piece.lower() in ["knight", "king", "pawn"]:
                    break  
                r += dr
                c += dc

    return moves


@app.route('/user_exists', methods=['POST'])
def user_exists():
    logging.info("Received request for /user_exists")

    if request.method != 'POST':
        return "Invalid request method", 405

    data = request.get_json()
    if not data:
        return "Invalid input", 400

    username = data.get("username")
    password = data.get("password")
    logging.info(f"Parsed credentials: {data}")

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = "SELECT EXISTS (SELECT 1 FROM Players WHERE username = %s AND password = %s)"
        logging.info(f"Executing query: {query}")
        cur.execute(query, (username, password))
        exists = cur.fetchone()[0]

        cur.close()
        conn.close()

        logging.info(f"Query result: exists = {exists}")
        return jsonify({"exists": exists})
    except Exception as e:
        logging.error(f"Database query failed: {e}")
        return "Database query failed", 500


import json

def compute_valid_moves(colour, piece_position, chess_board):
    row, col = piece_position["row"], piece_position["col"]
    piece = chess_board[row][col]

    if not piece:
        return []

    moves = []

    if piece in ["♙", "♟"]:  
        direction = -1 if piece == "♙" else 1
        if 0 <= row + direction < 8 and not chess_board[row + direction][col]:
            moves.append({"row": row + direction, "col": col}) 
      

    elif piece in ["♜", "♖"]: 
        moves += get_linear_moves(row, col, chess_board, directions=[(1, 0), (-1, 0), (0, 1), (0, -1)])

    elif piece in ["♞", "♘"]: 
        moves += get_knight_moves(row, col, chess_board)

    elif piece in ["♗", "♝"]: 
        moves += get_linear_moves(row, col, chess_board, directions=[(1, 1), (-1, -1), (1, -1), (-1, 1)])

    elif piece in ["♛", "♕"]: 
        moves += get_linear_moves(row, col, chess_board, directions=[(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)])

    elif piece in ["♚", "♔"]: 
        moves += get_king_moves(row, col, chess_board)

    return moves


def get_linear_moves(row, col, chess_board, directions):
    """ Helper function for Rook, Bishop, Queen movements """
    moves = []
    for dr, dc in directions:
        r, c = row + dr, col + dc
        while 0 <= r < 8 and 0 <= c < 8 and not chess_board[r][c]:
            moves.append({"row": r, "col": c})
            r += dr
            c += dc
    return moves


def get_knight_moves(row, col, chess_board):
    """ Helper function for Knight movements """
    moves = []
    knight_moves = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)]
    for dr, dc in knight_moves:
        r, c = row + dr, col + dc
        if 0 <= r < 8 and 0 <= c < 8:
            moves.append({"row": r, "col": c})
    return moves


def get_king_moves(row, col, chess_board):
    """ Helper function for King movements """
    moves = []
    king_moves = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)]
    for dr, dc in king_moves:
        r, c = row + dr, col + dc
        if 0 <= r < 8 and 0 <= c < 8:
            moves.append({"row": r, "col": c})
    return moves


@app.route("/show_moves", methods=["POST"])
def show_moves():
    try:
        data = request.get_json()
        print("Received data:", json.dumps(data, indent=4)) 

        colour = data["colour"]
        piece_position = data["piece_position"]
        chess_board = data["chess_board"]

        print(f"Processing moves for: {colour} piece at {piece_position}")

      
        valid_moves = compute_valid_moves(colour, piece_position, chess_board)

        response = {"positions": valid_moves}
        print("Returning moves:", json.dumps(response, indent=4))  
        return jsonify(response)
    except Exception as e:
        print("Error in show_moves:", str(e))
        return jsonify({"positions": []}) 

if __name__ == '__main__':
    logging.info("Server is running on port 8088...")
    app.run(host='0.0.0.0', port=8088)
