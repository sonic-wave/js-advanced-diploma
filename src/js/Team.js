/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor(characters) {
    if (characters !== null) {
      const char = [];
      for (let i = 0; i < characters.length; i += 1) {
        char.push(characters[i]);
      }
      this.characters = char;
    }
  }
}
