import NewFunctions from '../newFunctions';
import distance from '../distance';
import GameController from '../GameController';
import GamePlay from '../GamePlay';

const gamePlay = new GamePlay();
const gameCtrl = new GameController(gamePlay);
gameCtrl.characters = [
  {
    character: {
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      type: 'swordsman',
      attackDistance: 1,
      moveDistance: 4,
    },
    position: 29,
  },
  {
    character: {
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'bowman',
      attackDistance: 2,
      moveDistance: 2,
    },
    position: 24,
  },
  {
    character: {
      level: 1,
      attack: 25,
      defence: 25,
      health: 50,
      type: 'vampire',
      attackDistance: 2,
      moveDistance: 2,
    },
    position: 63,
  },
  {
    character: {
      level: 1,
      attack: 40,
      defence: 10,
      health: 50,
      type: 'undead',
      attackDistance: 1,
      moveDistance: 4,
    },
    position: 38,
  },
];

test.each([
  [29, gameCtrl.characters[0]],
  [24, gameCtrl.characters[1]],
  [63, gameCtrl.characters[2]],
  [38, gameCtrl.characters[3]],
  [12, undefined],
  [7, undefined],
])('checkCharacterInCell', (index, expected) => {
  const result = gameCtrl.checkCharacterInCell(index);
  expect(result).toBe(expected);
});

test.each([
  [gameCtrl.characters[0], true],
  [gameCtrl.characters[1], true],
  [gameCtrl.characters[2], false],
  [gameCtrl.characters[3], false],
])('isPlayableCharacter', (char, expected) => {
  const result = NewFunctions.isPlayableCharacter(char);
  expect(result).toBe(expected);
});

test.each([
  [gameCtrl.characters[0],
    [11, 13, 15, 2, 20, 21, 22, 25, 26, 27, 28, 30, 31, 36, 37, 38, 43, 45, 47, 5, 50, 53, 57, 61]],
  [gameCtrl.characters[1], [10, 16, 17, 25, 26, 32, 33, 40, 42, 8]],
  [gameCtrl.characters[2], [45, 47, 54, 55, 61, 62]],
  [gameCtrl.characters[3],
    [11, 14, 2, 20, 22, 29, 30, 31, 34, 35, 36, 37, 39, 45, 46, 47, 52, 54, 59, 6, 62]],
])('move distance', (char, expected) => {
  const result = distance(char, char.position, 'move');
  expect(result.sort()).toEqual(expected.sort());
});

test.each([
  [gameCtrl.characters[0], [20, 21, 22, 28, 29, 30, 36, 37, 38]],
  [gameCtrl.characters[1], [10, 16, 17, 18, 24, 25, 26, 32, 33, 34, 40, 41, 42, 8, 9]],
  [gameCtrl.characters[2], [45, 46, 47, 53, 54, 55, 61, 62, 63]],
  [gameCtrl.characters[3], [29, 30, 31, 37, 38, 39, 45, 46, 47]],
])('attack distance', (char, expected) => {
  const result = distance(char, char.position, 'attack');
  expect(result.sort()).toEqual(expected.sort());
});
