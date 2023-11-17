import Character from '../Character';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test.each([
  [Bowman, {
    level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackDistance: 2, moveDistance: 2,
  }],
  [Magician, {
    level: 1, attack: 10, defence: 40, health: 50, type: 'magician', attackDistance: 4, moveDistance: 1,
  }],
  [Swordsman, {
    level: 1, attack: 40, defence: 10, health: 50, type: 'swordsman', attackDistance: 1, moveDistance: 4,
  }],
  [Daemon, {
    level: 1, attack: 10, defence: 10, health: 50, type: 'daemon', attackDistance: 4, moveDistance: 1,
  }],
  [Undead, {
    level: 1, attack: 40, defence: 10, health: 50, type: 'undead', attackDistance: 1, moveDistance: 4,
  }],
  [Vampire, {
    level: 1, attack: 25, defence: 25, health: 50, type: 'vampire', attackDistance: 2, moveDistance: 2,
  }],
])('Character classes', (Char, expected) => {
  const result = new Char(1);
  expect(result).toEqual(expected);
});

test('Character error', () => {
  expect(() => new Character(1)).toThrowError(new Error('Хей, это же Character, ты чего? Создай нужный класс'));
});
