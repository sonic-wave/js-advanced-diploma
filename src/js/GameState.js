export default class GameState {
  // static from(object) {
  //   // TODO: create object
  //   return null;
  // }

  constructor() {
    this.bestPoints = 0;
    this.gameData = null;
  }

  saveBestPoints(points) {
    if (points > this.bestPoints) {
      this.bestPoints = points;
    }
  }

  saveDataGame(data) {
    this.gameData = {
      level: data.level,
      turn: data.turn,
      points: data.points,
      userTeam: data.userTeam,
      compTeam: data.compTeam,
      characters: data.characters,
    };
    return this.gameData;
  }
}
