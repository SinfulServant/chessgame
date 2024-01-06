class Piece {
  constructor(position, color, game) {
    this._position = position;
    this.color = color; // can be true or false
    this.game = game;
    this.pieceName = this.constructor.name;
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
      this.game.chessBoard[nY][nX].isEmpty = false;
      this.game.chessBoard[nY][nX].piece = this.game.chessBoard[y][x].piece;

      this.game.chessBoard[y][x].isEmpty = true;
      this.game.chessBoard[y][x].piece = undefined;
    }
  }

  positionValidator(x, y) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  checkNextPositionPiece(x, y) {
    return (
      this.game.chessBoard[y][x].isEmpty ||
      this.game.chessBoard[y][x]?.piece?.color !== this.color
    );
  }

  possibleMoves() {
    return [];
  }
}

class Pawn extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
  }

  possibleMoves(enPassant) {
    var { x, y } = this._position;
    var possibleMovesArr = [];
    if (!this.color) {
      // if black
      if (y === 1) possibleMovesArr.push({ x: x, y: y + 2 }); // double move ahead
      if (this.game.chessBoard[y + 1][x].isEmpty)
        possibleMovesArr.push({ x: x, y: y + 1 }); // move ahead
      if (
        this.game.chessBoard[y + 1][x + 1]?.piece?.color !== this.color &&
        this.game.chessBoard[y + 1][x + 1]?.piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x + 1, y: y + 1 }); // attack ahead right
      if (
        this.game.chessBoard[y + 1][x - 1]?.piece?.color !== this.color &&
        this.game.chessBoard[y + 1][x - 1]?.piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x - 1, y: y + 1 }); // attack ahead left
    } else {
      // if white
      if (y === 6) possibleMovesArr.push({ x: x, y: y - 2 }); // double move ahead
      if (this.game.chessBoard[y - 1][x].isEmpty)
        possibleMovesArr.push({ x: x, y: y - 1 }); // move ahead
      if (
        this.game.chessBoard[y - 1][x + 1]?.piece?.color !== this.color &&
        this.game.chessBoard[y - 1][x + 1]?.piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x + 1, y: y - 1 }); // attack ahead right
      if (
        this.game.chessBoard[y - 1][x - 1]?.piece?.color !== this.color &&
        this.game.chessBoard[y - 1][x - 1]?.piece?.color !== undefined
      )
        possibleMovesArr.push({ x: x - 1, y: y - 1 }); // attack ahead left
    }
    return possibleMovesArr;
  }
}

class Bishop extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
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
      if (this.game.chessBoard[++y][++x]?.piece?.color === this.color) break;
      if (this.checkNextPositionPiece(x, y))
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x + 1, y - 1)
    ) {
      if (this.game.chessBoard[--y][++x]?.piece?.color === this.color) break;
      if (this.checkNextPositionPiece(x, y))
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y + 1)
    ) {
      if (this.game.chessBoard[++y][--x]?.piece?.color === this.color) break;
      if (this.checkNextPositionPiece(x, y))
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y - 1)
    ) {
      if (this.game.chessBoard[--y][--x]?.piece?.color === this.color) break;
      if (this.checkNextPositionPiece(x, y))
        possibleMovesArr.push({ x: x, y: y });
      possibleMovesArr.push({ x: x, y: y });
    }
    return possibleMovesArr;
  }
}

class Knight extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
  }
  possibleMoves() {
    var possibleMoves = [];
    var { x, y } = this._position;
    var allPossibleMoves = [
      { x: x - 1, y: y + 2 },
      { x: x + 1, y: y + 2 },
      { x: x + 2, y: y + 1 },
      { x: x + 2, y: y - 1 },
      { x: x + 1, y: y - 2 },
      { x: x - 1, y: y - 2 },
      { x: x - 2, y: y - 1 },
      { x: x - 2, y: y + 1 },
    ];
    for (var item of allPossibleMoves) {
      var { x, y } = item;
      if (this.positionValidator(x, y) && this.checkNextPositionPiece(x, y))
        possibleMoves.push(item);
    }
    return possibleMoves;
  }
}

class Rook extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
  }

  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;
    var resetXY = () => {
      x = this._position.x;
      y = this._position.y;
    };
    while (this.positionValidator(x, y) && this.positionValidator(x + 1, y)) {
      if (this.game.chessBoard[y][++x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y + 1)) {
      if (this.game.chessBoard[++y][x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x - 1, y)) {
      if (this.game.chessBoard[y][--x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y - 1)) {
      if (this.game.chessBoard[--y][x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    return possibleMovesArr;
  }
}

class Queen extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
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
      if (this.game.chessBoard[++y][++x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x + 1, y - 1)
    ) {
      if (this.game.chessBoard[--y][++x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y + 1)
    ) {
      if (this.game.chessBoard[++y][--x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (
      this.positionValidator(x, y) &&
      this.positionValidator(x - 1, y - 1)
    ) {
      if (this.game.chessBoard[--y][--x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }

    while (this.positionValidator(x, y) && this.positionValidator(x + 1, y)) {
      if (this.game.chessBoard[y][++x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y + 1)) {
      if (this.game.chessBoard[++y][x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x - 1, y)) {
      if (this.game.chessBoard[y][--x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    resetXY();
    while (this.positionValidator(x, y) && this.positionValidator(x, y - 1)) {
      if (this.game.chessBoard[--y][x]?.piece?.color === this.color) break;
      if (
        this.game.chessBoard[y][x].isEmpty ||
        this.game.chessBoard[y][x]?.piece?.color !== this.color
      )
        possibleMovesArr.push({ x: x, y: y });
    }
    return possibleMovesArr;
  }
}

class King extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
  }
  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;

    for (var newX = -1; newX <= 1; newX++) {
      if (
        this.positionValidator(x + newX, y + 1) &&
        this.checkNextPositionPiece(x + newX, y + 1)
      )
        possibleMovesArr.push({ x: x + newX, y: y + 1 });
      if (
        this.positionValidator(x + newX, y - 1) &&
        this.checkNextPositionPiece(x + newX, y - 1)
      )
        possibleMovesArr.push({ x: x + newX, y: y - 1 });
    }
    if (
      this.positionValidator(x + 1, y) &&
      this.checkNextPositionPiece(x + 1, y)
    )
      possibleMovesArr.push({ x: x + 1, y: y });
    if (
      this.positionValidator(x - 1, y) &&
      this.checkNextPositionPiece(x - 1, y)
    )
      possibleMovesArr.push({ x: x - 1, y: y });

    return possibleMovesArr.filter(
      (pos) => !this.isSquareAttacked().has(JSON.stringify(pos))
    );
  }

  // For checking is the square where the king wants to move is attacked by enemy piece
  isSquareAttacked() {
    var squaresUnderAttack = new Set();
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        var square = this.game.chessBoard[y][x];
        if (square.piece && square.piece.color !== this.color) {
          var possibleMoves =
            square.piece.pieceName !== "Pawn"
              ? square.piece.possibleMoves()
              : (() => {
                  var { x, y } = square.piece._position;
                  return [
                    { x: x + 1, y: square.piece.color ? y - 1 : y + 1 },
                    { x: x - 1, y: square.piece.color ? y - 1 : y + 1 },
                  ];
                })();
          possibleMoves.forEach((item) =>
            squaresUnderAttack.add(JSON.stringify(item))
          );
        }
      }
    }
    return squaresUnderAttack;
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
        // Empty squares
        if (y > 1 && y < 6)
          this.chessBoard[y][x] = new Square(true, { x: x, y: y });

        // Bishops
        if (
          (y === 0 && x === 2) ||
          (y === 0 && x === 5) ||
          (y === 7 && x === 2) ||
          (y === 7 && x === 5)
        )
          this.chessBoard[y][x] = new Square(
            false,
            { x: x, y: y },
            new Bishop({ x: x, y: y }, color, this)
          );

        //Rooks
        if (
          (y === 0 && x === 0) ||
          (y === 0 && x === 7) ||
          (y === 7 && x === 0) ||
          (y === 7 && x === 7)
        )
          this.chessBoard[y][x] = new Square(
            false,
            { x: x, y: y },
            new Rook({ x: x, y: y }, color, this)
          );

        //Knights
        if (
          (y === 0 && x === 1) ||
          (y === 0 && x === 6) ||
          (y === 7 && x === 1) ||
          (y === 7 && x === 6)
        )
          this.chessBoard[y][x] = new Square(
            false,
            { x: x, y: y },
            new Knight({ x: x, y: y }, color, this)
          );

        //Kings
        if ((y === 0 && x === 4) || (y === 7 && x === 4))
          this.chessBoard[y][x] = new Square(
            false,
            { x: x, y: y },
            new King({ x: x, y: y }, color, this)
          );

        //Queens
        if ((y === 0 && x === 3) || (y === 7 && x === 3))
          this.chessBoard[y][x] = new Square(
            false,
            { x: x, y: y },
            new Queen({ x: x, y: y }, color, this)
          );

        //Pawns
        if (y === 1 || y === 6)
          this.chessBoard[y][x] = new Square(
            false,
            { x: x, y: y },
            new Pawn({ x: x, y: y }, color, this)
          );
      }
    }
  }
}

class Square {
  constructor(isEmpty, position, piece = undefined) {
    this.isEmpty = isEmpty;
    this.piece = piece;
    this.position = position;
  }
}

// var game = new ChessBoard();
// var chessBoard = game.chessBoard;

// Show all board
// for (let y = 0; y <= 7; y++) {
//   for (let x = 0; x <= 7; x++) {
//     doLog(`y: ${y} | x: ${x}`, game.chessBoard[y][x]);
//   }
// }

// check king`s moves
// var blackKing = chessBoard[0][4].piece;
// chessBoard[1][4].piece.doMove(4, 3);
// doLog(blackKing.possibleMoves().length, "Must be 1");
// blackKing.doMove(4, 1);
// doLog(blackKing.possibleMoves().length, "Must be 4");
// blackKing.doMove(4, 2);
// doLog(blackKing.possibleMoves().length, "Must be 5");
// blackKing.doMove(5, 3);
// doLog(blackKing.possibleMoves().length, "Must be 7");
// blackKing.doMove(6, 4);
// // doLog(blackKing.isSquareAttacked());
// doLog(blackKing.possibleMoves().length, "Must be 5");

//check knight moves
// var knightBlackLeft = chessBoard[0][1].piece
// console.log(knightBlackLeft.possibleMoves())
// knightBlackLeft.doMove(2, 2)
// console.log(knightBlackLeft.possibleMoves())
// knightBlackLeft.doMove(4, 3)
// console.log(knightBlackLeft.possibleMoves())
// knightBlackLeft.doMove(2, 4)
// console.log(knightBlackLeft.possibleMoves())
