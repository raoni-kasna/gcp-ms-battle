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
      (x === this.arena.dims[0] - 1  && direction === "E") ||
      (y === 0 && direction === "N") ||
      (y === this.arena.dims[0] - 1 && direction === "S");
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
        validMoves.push("F");
      }
    }

    // R
    const invalidRight =
      (x === this.arena.dims[0] - 1 && direction === "N") ||
      (x === 0 && direction === "S") ||
      (y === 0 && direction === "W") ||
      (y === this.arena.dims[0] - 1 && direction === "E");
    if (!invalidRight) {
      validMoves.push("R");
    }

    // L
    const invalidLeft =
      (x === this.arena.dims[0] - 1 && direction === "S") ||
      (x === 0 && direction === "N") ||
      (y === 0 && direction === "E") ||
      (y === this.arena.dims[0] -1 && direction === "W");
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

  calculateNextMove() {
    const playersOfInterest = this.findPlayersOfInterest();
    const validMoves = this.getValidNextMoves(playersOfInterest);

    // if (
    //   playersOfInterest.threats.length > 0 &&
    //   (this.player.wasHit || playersOfInterest.targets.length === 0)
    // ) {
    //   console.error("move to threat", playersOfInterest.threats.join(","));
    //   if (validMoves.includes('F')) {
    //     return 'F'
    //   }

    //   return validMoves[Math.floor(Math.random() * validMoves.length)];
    // }

    if (this.player.wasHit) {
      const nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      console.error("Random move");
      return nextMove;
    }


    if (playersOfInterest.targets.length > 0) {
      console.error("throw", playersOfInterest.targets[0]);
      return "T";
    }

    
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
