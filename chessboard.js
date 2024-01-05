console.log(
  "__________________________________________________________________________________"
);

class Piece {
  constructor(position, color) {
    this._position = position;
    this.color = color; // can be true or false
  }

  get position() {
    return this._position;
  }

  doMove(nX, nY) {
    var { x, y } = this._position;
    if (
      this.possibleMoves().find(
        (possibleMove) =>
          JSON.stringify(possibleMove) === JSON.stringify({ x: nX, y: nY })
      )
    ) {
      this._position = { x: nX, y: nY };
      game.chessBoard[nY][nX].isEmpty = false;
      game.chessBoard[nY][nX].piece = game.chessBoard[y][x].piece;
      
      game.chessBoard[y][x].isEmpty = true;
      game.chessBoard[y][x].piece = undefined;
    }
  }

  positionValidator(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  possibleMoves() {}
}

class Pawn extends Piece {
  constructor(position, color) {
    super(position, color);
  }

  possibleMoves(enPassant) {
    var { x, y } = this._position;
    var possibleMovesArr = [];
    if (!this.color) {
      // if black
      if (y === 1) possibleMovesArr.push({ x: x, y: y + 2 }); // double move ahead
      if (game.chessBoard[y + 1][x].isEmpty)
        possibleMovesArr.push({ x: x, y: y + 1 }); // move ahead
      if (
        game.chessBoard[y + 1][x + 1].piece?.color !== this.color &&
        game.chessBoard[y + 1][x + 1].piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x + 1, y: y + 1 }); // attack ahead right
      if (
        game.chessBoard[y + 1][x - 1].piece?.color !== this.color &&
        game.chessBoard[y + 1][x - 1].piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x - 1, y: y + 1 }); // attack ahead left
    } else {
      // if white
      if (y === 6) possibleMovesArr.push({ x: x, y: y - 2 }); // double move ahead
      if (game.chessBoard[y - 1][x].isEmpty)
        possibleMovesArr.push({ x: x, y: y - 1 }); // move ahead
      if (
        game.chessBoard[y - 1][x + 1].piece?.color !== this.color &&
        game.chessBoard[y - 1][x + 1].piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x + 1, y: y - 1 }); // attack ahead right
      if (
        game.chessBoard[y - 1][x - 1].piece?.color !== this.color &&
        game.chessBoard[y - 1][x - 1].piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x - 1, y: y - 1 }); // attack ahead left
    }
    return possibleMovesArr;
  }
}

class Bishop extends Piece {
  constructor(position, color) {
    super(position, color);
  }

  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;
    var resetXY = () => {
      x = this._position.x;
      y = this._position.y;
    };
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x + 1, y + 1)
    ) {
      if (game.chessBoard[++y][++x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x + 1, y - 1)
    ) {
      if (game.chessBoard[--y][++x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y + 1)
    ) {
      if (game.chessBoard[++y][--x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y - 1)
    ) {
      if (game.chessBoard[--y][--x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    return possibleMovesArr;
  }
}

class Knight extends Piece {
  constructor(position, color) {
    super(position, color);
  }
}

class Rock extends Piece {
  constructor(position, color) {
    super(position, color);
  }

  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;
    var resetXY = () => {
      x = this._position.x;
      y = this._position.y;
    };
    while (this.positionValidator(x, y) && this.positionValidator(x + 1, y)) {
      if (game.chessBoard[y][++x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y + 1)) {
      if (game.chessBoard[++y][x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x - 1, y)) {
      if (game.chessBoard[y][--x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y - 1)) {
      if (game.chessBoard[--y][x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    return possibleMovesArr;
  }
}

class Queen extends Piece {
  constructor(position, color) {
    super(position, color);
  }

  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;
    var resetXY = () => {
      x = this._position.x;
      y = this._position.y;
    };

    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x + 1, y + 1)
    ) {
      if (game.chessBoard[++y][++x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x + 1, y - 1)
    ) {
      if (game.chessBoard[--y][++x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y + 1)
    ) {
      if (game.chessBoard[++y][--x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y - 1)
    ) {
      if (game.chessBoard[--y][--x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }

    while (this.positionValidator(x, y) && this.positionValidator(x + 1, y)) {
      if (game.chessBoard[y][++x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y + 1)) {
      if (game.chessBoard[++y][x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x - 1, y)) {
      if (game.chessBoard[y][--x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y - 1)) {
      if (game.chessBoard[--y][x]?.piece?.color === this.color) break;
      if (
        game.chessBoard[y][x].isEmpty ||
        game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    return possibleMovesArr;
  }
}

class King extends Piece {
  constructor(position, color) {
    super(position, color);
  }
  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;
    var resetXY = () => {
      x = this._position.x;
      y = this._position.y;
    };

    for (var x = -1; x <= 1; x++) {
      // if()
    }
  }
}

class ChessBoard {
  chessBoard = [];
  constructor() {
    this.createNewGame();
  }
  createNewGame() {
    for (var y = 0; y <= 7; y++) {
      this.chessBoard[y] = [];
      var color = y <= 1 ? false : true;
      for (var x = 0; x <= 7; x++) {
        if (y > 1 && y < 6) this.chessBoard[y][x] = new Square(true);
        if (
          (y === 0 && x === 2) ||
          (y === 0 && x === 5) ||
          (y === 7 && x === 2) ||
          (y === 7 && x === 5)
        )
          this.chessBoard[y][x] = new Square(
            false,
            new Bishop({ x: x, y: y }, color)
          ); // Bishops
        if (
          (y === 0 && x === 0) ||
          (y === 0 && x === 7) ||
          (y === 7 && x === 0) ||
          (y === 7 && x === 7)
        )
          this.chessBoard[y][x] = new Square(
            false,
            new Rock({ x: x, y: y }, color)
          ); // Rocks
        if (
          (y === 0 && x === 1) ||
          (y === 0 && x === 6) ||
          (y === 7 && x === 1) ||
          (y === 7 && x === 6)
        )
          this.chessBoard[y][x] = new Square(
            false,
            new Knight({ x: x, y: y }, color)
          ); // Knights
        if ((y === 0 && x === 4) || (y === 7 && x === 4))
          this.chessBoard[y][x] = new Square(
            false,
            new King({ x: x, y: y }, color)
          ); // Kings
        if ((y === 0 && x === 3) || (y === 7 && x === 3))
          this.chessBoard[y][x] = new Square(
            false,
            new Queen({ x: x, y: y }, color)
          ); // Queens
        if (y === 1 || y === 6)
          this.chessBoard[y][x] = new Square(
            false,
            new Pawn({ x: x, y: y }, color)
          ); // Pawns
      }
    }
  }
}

class Square {
  constructor(isEmpty, piece = undefined) {
    this.isEmpty = isEmpty;
    this.piece = piece;
  }
}

var game = new ChessBoard();

for (let y = 0; y <= 7; y++) {
  for (let x = 0; x <= 7; x++) {
    console.log(`y: ${y} | x: ${x}`, game.chessBoard[y][x]);
  }
}
