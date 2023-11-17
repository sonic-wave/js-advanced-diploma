import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export default class NewFunctions {
  static createClass(name, level) {
    switch (name) {
      case 'Bowman': return new Bowman(level);
      case 'Swordsman': return new Swordsman(level);
      case 'Magician': return new Magician(level);
      case 'Daemon': return new Daemon(level);
      case 'Undead': return new Undead(level);
      case 'Vampire': return new Vampire(level);
      default: console.log('Sorry');
    }
    return false;
  }

  static isPlayableCharacter(char) {
    if (char.character.type === 'bowman' || char.character.type === 'magician' || char.character.type === 'swordsman') {
      return true;
    }
    return false;
  }

  static compMoveRange(rangeAttackUser, rangeMove, cellCanMove) {
    rangeAttackUser.forEach((itemAttack) => {
      rangeMove.forEach((itemMove) => {
        if (itemMove === itemAttack) {
          cellCanMove.push(itemMove);
        }
      });
    });
  }

  static levelUp(char) {
    const character = char;
    character.character.level += 1;

    NewFunctions.levelUpAttackDefence(character);

    character.character.health += 80;
    if (character.character.health > 100) {
      character.character.health = 100;
    }

    Math.round(character.character.health);

    return character;
  }

  static levelUpAttackDefence(char) {
    const character = char;
    character.character.attack = Math.round(Math.max(
      character.character.attack,
      (character.character.attack * (80 + character.character.health)) / 100,
    ));
    character.character.defence = Math.round(Math.max(
      character.character.defence,
      (character.character.defence * (80 + character.character.health)) / 100,
    ));
    return character;
  }
}
