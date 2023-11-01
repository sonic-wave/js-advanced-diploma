import Character from '../Character';

export default class Vampire extends Character {
  constructor(level, type = 'Vampire') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
    this.moveDistance = 2;
    this.attackDistance = 2;
  }
}
