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

  doMove(nX, nY, additionalFunc = () => {}, force) {
    if (this.game.whoseTurn === this.color) {
      var { x, y } = this._position;
      if (
        force ||
        this.possibleMoves().find(
          (possibleMove) =>
            JSON.stringify(possibleMove) === JSON.stringify({ x: nX, y: nY })
        )
      ) {
        if (
          // delete enemy piece
          this.game.chessBoard[nY][nX].piece &&
          this.game.chessBoard[nY][nX].piece.color !== this.color
        )
          this.game[this.color ? "blackPieces" : "whitePieces"] = this.game[
            this.color ? "blackPieces" : "whitePieces"
          ].filter((item) => item !== this.game.chessBoard[nY][nX].piece);

        // update data of NEW square
        this._position = { x: nX, y: nY };
        this.game.chessBoard[nY][nX].isEmpty = false;
        this.game.chessBoard[nY][nX].piece = this.game.chessBoard[y][x].piece;
        // update data of OLD square
        this.game.chessBoard[y][x].isEmpty = true;
        this.game.chessBoard[y][x].piece = undefined;

        if (additionalFunc) additionalFunc();
        this.game.whoseTurn = !this.game.whoseTurn;
      }
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

  possibleMoves() {
    var { x, y } = this._position;
    var possibleMovesArr = [];
    if (!this.color) {
      // if black
      if (
        y === 1 &&
        this.game.chessBoard[y + 1][x].isEmpty &&
        this.game.chessBoard[y + 2][x].isEmpty
      )
        possibleMovesArr.push({ x: x, y: y + 2 }); // double move ahead
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
      if (
        y === 6 &&
        this.game.chessBoard[y - 1][x].isEmpty &&
        this.game.chessBoard[y - 2][x].isEmpty
      )
        possibleMovesArr.push({ x: x, y: y - 2 }); // double move ahead
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
    var calcPossibleMoves = (xChanger, yChanger) => {
      var newX = x + xChanger,
        newY = y + yChanger;
      while (this.positionValidator(newX, newY)) {
        if (this.game.chessBoard[newY][newX]?.piece?.color === this.color)
          break;
        if (this.checkNextPositionPiece(newX, newY))
          possibleMovesArr.push({ x: newX, y: newY });
        if (
          this.game.chessBoard[newY][newX].piece &&
          this.game.chessBoard[newY][newX].piece.color !== this.color &&
          this.game.chessBoard[newY][newX].piece.pieceName === "King"
        )
          // if check to king
          possibleMovesArr.push({ x: newX + xChanger, y: newY + yChanger });
        if (
          this.game.chessBoard[newY][newX].piece &&
          this.game.chessBoard[newY][newX].piece.color !== this.color
        )
          break;
        newX += xChanger;
        newY += yChanger;
      }
    };

    var diagonals = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    diagonals.forEach((item) => calcPossibleMoves(...item));
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

  didMove = false;

  doMove(nX, nY, _, force) {
    super.doMove(nX, nY, () => (this.didMove = true), force);
  }

  possibleMoves() {
    var possibleMovesArr = [];
    var { x, y } = this._position;
    var calcPossibleMoves = (xChanger, yChanger) => {
      var newX = x + xChanger,
        newY = y + yChanger;
      while (this.positionValidator(newX, newY)) {
        if (this.game.chessBoard[newY][newX]?.piece?.color === this.color)
          break;
        if (this.checkNextPositionPiece(newX, newY))
          possibleMovesArr.push({ x: newX, y: newY });
        if (
          this.game.chessBoard[newY][newX].piece &&
          this.game.chessBoard[newY][newX].piece.color !== this.color &&
          this.game.chessBoard[newY][newX].piece.pieceName === "King"
        )
          // if check to king
          possibleMovesArr.push({ x: newX + xChanger, y: newY + yChanger });
        if (
          this.game.chessBoard[newY][newX].piece &&
          this.game.chessBoard[newY][newX].piece.color !== this.color
        )
          break;
        newX += xChanger;
        newY += yChanger;
      }
    };
    var lines = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    lines.forEach((item) => calcPossibleMoves(...item));
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
    var calcPossibleMoves = (xChanger, yChanger) => {
      var newX = x + xChanger,
        newY = y + yChanger;
      while (this.positionValidator(newX, newY)) {
        if (this.game.chessBoard[newY][newX]?.piece?.color === this.color)
          break;
        if (this.checkNextPositionPiece(newX, newY))
          possibleMovesArr.push({ x: newX, y: newY });
        if (
          this.game.chessBoard[newY][newX].piece &&
          this.game.chessBoard[newY][newX].piece.color !== this.color &&
          this.game.chessBoard[newY][newX].piece.pieceName === "King"
        )
          // if check to king
          possibleMovesArr.push({ x: newX + xChanger, y: newY + yChanger });
        if (
          this.game.chessBoard[newY][newX].piece &&
          this.game.chessBoard[newY][newX].piece.color !== this.color
        )
          break;
        newX += xChanger;
        newY += yChanger;
      }
    };
    var linesAndDiagonals = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    linesAndDiagonals.forEach((item) => calcPossibleMoves(...item));
    return possibleMovesArr;
  }
}

class King extends Piece {
  constructor(position, color, game) {
    super(position, color, game);
  }

  didMove = false;

  doMove(nX, nY) {
    var startY = this.color ? 7 : 0;
    var additionalLogicForDoMove = () => {
      if (!this.didMove) {
        if (nX === 2 && nY === startY) {
          this.game.chessBoard[startY][0].piece.doMove(
            3,
            startY,
            () => {},
            true
          );
        }
        if (nX === 6 && nY === startY) {
          this.game.chessBoard[startY][7].piece.doMove(
            5,
            startY,
            () => {},
            true
          );
        }
      }
      this.didMove = true;
      this.game.whoseTurn = this.color;
    };
    super.doMove(nX, nY, additionalLogicForDoMove);
  }

  possibleMoves(checkedByEnemyKing = false) {
    var possibleMovesArr = [];
    var { x, y } = this._position;

    // checking castle
    var checkColor = this.color ? 7 : 0;
    var castleToRightFree = [
      !this.didMove,
      this.game.chessBoard[checkColor][5].isEmpty,
      this.game.chessBoard[checkColor][6].isEmpty,
      !this.game.chessBoard[checkColor][7].piece?.didMove,
      this.game.chessBoard[checkColor][7].piece?.didMove !== undefined,
    ];
    var castleToLeftFree = [
      !this.didMove,
      this.game.chessBoard[checkColor][3].isEmpty,
      this.game.chessBoard[checkColor][2].isEmpty,
      this.game.chessBoard[checkColor][1].isEmpty,
      !this.game.chessBoard[checkColor][0].piece?.didMove,
      this.game.chessBoard[checkColor][0].piece?.didMove !== undefined,
    ];
    if (castleToRightFree.every((item) => item))
      possibleMovesArr.push({ x: x + 2, y: y });
    if (castleToLeftFree.every((item) => item))
      possibleMovesArr.push({ x: x - 2, y: y });

    // checking the square where will be rook after castle, isn`t it under attack
    var checkIsSquareFree = (possibleMove, _, arr) => {
      var { x, y } = possibleMove;
      if (
        !this.didMove &&
        ((x === 6 && y === checkColor) || (x === 2 && y === checkColor))
      ) {
        if (x === 6 && y === checkColor)
          return arr.some((item) => item.x === 5 && item.y === checkColor);
        if (x === 2 && y === checkColor)
          return arr.some((item) => item.x === 3 && item.y === checkColor);
      }
      return true;
    };

    // main calc possible moves
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

    // if (castleToRightFree.every(item => item) && isCastleToRightUnderAttack) possibleMovesArr.push({x: x + 2, y: y})
    // if (castleToLeftFree.every(item => item) && isCastleToLeftUnderAttack) possibleMovesArr.push({x: x - 2, y: y})

    return checkedByEnemyKing
      ? possibleMovesArr
      : possibleMovesArr
          .filter((pos) => !this.isSquareAttacked().has(JSON.stringify(pos)))
          .filter(checkIsSquareFree);
  }

  // For checking is the square where the king wants to move is attacked by enemy piece
  isSquareAttacked() {
    var squaresUnderAttack = new Set();
    var enemyPieces = this.color
      ? this.game.blackPieces
      : this.game.whitePieces;

    for (let piece of enemyPieces) {
      var possibleMoves =
        piece.pieceName !== "Pawn"
          ? piece.possibleMoves(true)
          : (() => {
              var { x, y } = piece._position;
              return [
                { x: x + 1, y: piece.color ? y - 1 : y + 1 },
                { x: x - 1, y: piece.color ? y - 1 : y + 1 },
              ];
            })();

      possibleMoves.forEach((item) =>
        squaresUnderAttack.add(JSON.stringify(item))
      );
    }
    return squaresUnderAttack;
  }
}

class ChessBoard {
  chessBoard = [];
  constructor() {
    this.createNewGame();
    this.writeDownPieces();
  }
  blackPieces = [];
  whitePieces = [];
  whoseTurn = true;

  writeDownPieces() {
    for (let y = 0; y <= 7; y++) {
      for (let x = 0; x <= 7; x++) {
        this.chessBoard[y][x]?.piece?.color
          ? this.whitePieces.push(this.chessBoard[y][x].piece)
          : this.blackPieces.push(this.chessBoard[y][x].piece);
      }
      if (y === 1) y = 5;
    }
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
