module.exports = class ArenaSimulator {
  constructor(arena) {
    this.arena = arena.arena;
    this.player = this.arena.state[arena._links.self.href];
    console.error("player", this.player);
  }

  static isTarget(shooter, target) {
    switch (shooter.direction) {
      case "N":
        return shooter.x === target.x && shooter.y - 3 <= target.y;
      case "S":
        return shooter.x === target.x && shooter.y + 3 >= target.y;
      case "W":
        return shooter.y === target.y && shooter.x + 3 >= target.y;
      case "E":
        return shooter.y === target.y && shooter.x - 3 <= target.x;
      default:
        return false;
    }
  }

  getValidNextMoves(playersOfInterest) {
    const validMoves = [];
    const { x, y, direction } = this.player;

    // F
    const invalidForward =
      (x === 0 && direction === "W") ||
      (x === this.arena.dims[0] && direction === "E") ||
      (y === 0 && direction === "N") ||
      (y === this.arena.dims[0] && direction === "S");
    if (!invalidForward) {
      let canMoveForward = true;

      switch (direction) {
        case "N":
          canMoveForward = playersOfInterest.above !== null;
        case "S":
          canMoveForward = playersOfInterest.below !== null;
        case "W":
          canMoveForward = playersOfInterest.left !== null;
        case "E":
          canMoveForward = playersOfInterest.right !== null;
        default:
          canMoveForward = true;
      }

      if (canMoveForward) {
        givalidMoves.push("F");
      }
    }

    // R
    const invalidRight =
      (x === this.arena.dims[0] && direction === "N") ||
      (x === 0 && direction === "S") ||
      (y === 0 && direction === "W") ||
      (y === this.arena.dims[0] && direction === "E");
    if (!invalidRight) {
      validMoves.push("R");
    }

    // L
    const invalidLeft =
      (x === this.arena.dims[0] && direction === "S") ||
      (x === 0 && direction === "N") ||
      (y === 0 && direction === "E") ||
      (y === this.arena.dims[0] && direction === "W");
    if (!invalidLeft) {
      validMoves.push("L");
    }

    return validMoves;
  }

  findPlayersOfInterest() {
    const playersOfInterest = {
      targets: [],
      threats: [],
      left: null,
      right: null,
      above: null,
      below: null,
    };

    Object.keys(this.arena.state).forEach((playerId) => {
      const opponent = this.arena.state[playerId];

      if (this.player === opponent) {
        return; // skip yourself
      }

      const isTarget = ArenaSimulator.isTarget(this.player, opponent);
      if (isTarget) {
        console.error('target', playerId);
        console.error(this.player, opponent);
        playersOfInterest.targets.push(opponent);
      }

      const isThreat = ArenaSimulator.isTarget(opponent, this.player);
      if (isThreat) {
        console.error('threat', playerId);
        playersOfInterest.threats.push(opponent);
      }

      // top
      if (this.player.x == opponent.x && this.player.y === opponent.y + 1) {
        console.error("top", playerId);
        playersOfInterest.top = opponent;
      }

      // below
      if (this.player.x == opponent.x && this.player.y === opponent.y - 1) {
        console.error("below", playerId);
        playersOfInterest.below = opponent;
      }

      // left
      if (this.player.y == opponent.y && this.player.x === opponent.x - 1) {
        console.error("left", playerId);
        playersOfInterest.right = opponent;
      }

      // right
      if (this.player.y == opponent.y && this.player.x === opponent.x + 1) {
        console.error("right", playerId);
        playersOfInterest.right = opponent;
      }
    });

    return playersOfInterest;
  }

  // moveToThreat() {
  //   const opponent = threats.sort((a, b) => a.score - b.score);
  //   const { x, y, direction } = this.player;
  //   if (x === opponent.x) {
  //     if (y - opponent.y  < 0)
  //   }
  //   // move towards threat
  // }

  calculateNextMove() {
    const playersOfInterest = this.findPlayersOfInterest();

    if (
      playersOfInterest.threats.length > 0 &&
      (this.player.wasHit || playersOfInterest.targets.length === 0)
    ) {
      console.error("move to threat", playersOfInterest.threats.join(","));
      // return this.moveToThreat();
    }

    if (playersOfInterest.targets.length > 0) {
      // TODO: players might get stuck shooting each other
      console.error("throw", playersOfInterest.targets[0]);
      return "T";
    }

    const validMoves = this.getValidNextMoves(playersOfInterest);
    console.error("valid moves", validMoves);
    if (validMoves.includes("F")) {
      console.error("move forward");
      return "F";
    }

    const nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    console.error("Random move");

    return nextMove;
  }
};
