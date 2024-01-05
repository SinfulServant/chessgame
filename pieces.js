/*
Pieces has:
position: {x: number, y: number}
color: boolean
posibleMoves: (chessboard, enPassant) => [posibleMoves]
*/

class Pawn {
    constructor(position, color) {
        this._position = position;
        this.color = color // can be true or false
    }

    get position() {
        return this._position;
    }

    set position(newPos) {
        if (newPos.x >= 0 && newPos.x <= 7 && newPos.y >= 0 && newPos.y <= 7) {
            this._position = newPos;
        }
    }

    posibleMoves(chessboard, enPassant) {
        var posibleMovesArr = []
        if(this.color){ // if white
            if(this._position.y === 1) posibleMovesArr.push({x: 3, y: this._position.y}) // double move ahead
            if(chessboard[this._position.y + 1][this._position.x].isEmpty) posibleMovesArr.push({x: this._position.x, y: this._position.y + 1}) // move ahead
            if(chessboard[this._position.y + 1][this._position.x + 1].color !== this.color) posibleMovesArr.push({x: this._position.x + 1, y: this._position.y + 1}) // attack ahead right
            if(chessboard[this._position.y + 1][this._position.x - 1].color !== this.color) posibleMovesArr.push({x: this._position.x - 1, y: this._position.y + 1}) // attack ahead left
        } else { // if black
            if(this._position.y === 6) posibleMovesArr.push({x: 4, y: this._position.y}) // double move ahead
            if(chessboard[this._position.y - 1][this._position.x].isEmpty) posibleMovesArr.push({x: this._position.x, y: this._position.y - 1}) // move ahead
            if(chessboard[this._position.y - 1][this._position.x + 1].color !== this.color) posibleMovesArr.push({x: this._position.x + 1, y: this._position.y - 1}) // attack ahead right
            if(chessboard[this._position.y - 1][this._position.x - 1].color !== this.color) posibleMovesArr.push({x: this._position.x - 1, y: this._position.y - 1}) // attack ahead left
        }

        return posibleMovesArr
    }
}