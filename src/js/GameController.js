import themes from './themes';
import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { characterGenerator, generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.turn = 1;
    this.gameState = new GameState();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const heroPlayerTypes = [Bowman, Swordsman, Magician]; // доступные классы игрока
    const enemyPlayerTypes = [Vampire, Undead, Daemon]; // доступные классы игрока
    const characters = [];
    const heroTeam = generateTeam(heroPlayerTypes, 3, 4);
    const enemyTeam = generateTeam(enemyPlayerTypes, 3, 4);

    const heroPositions = [];
    const enemyPositions = [];

    function getHeroPositions() {
      for (let i = 0; i < 8 ** 2;) {
        if (i % 2 === 0) {
          heroPositions.push(i);
          i += 1;
        } else {
          heroPositions.push(i);
          i += 7;
        }
      }
    }

    function getEnemyPositions() {
      for (let j = 6; j < 8 ** 2;) {
        if (j % 2 === 0) {
          enemyPositions.push(j);
          j += 1;
        } else {
          enemyPositions.push(j);
          j += 7;
        }
      }
    }

    getHeroPositions();
    getEnemyPositions();

    let randomHeroPositionArray = heroPositions;
    let randomEnemyPositionArray = enemyPositions;

    function randomHeroPosition() {
      let result = 0;
      let newResult = 0;
      result = Math.floor(Math.random() * randomHeroPositionArray.length);
      newResult = randomHeroPositionArray[result];

      if (randomHeroPositionArray.includes(randomHeroPositionArray[result])) {
        randomHeroPositionArray = randomHeroPositionArray.filter((word) => word !== randomHeroPositionArray[result]);
      }
      return newResult;
    }

    function randomEnemyPosition() {
      let result = 0;
      let newResult = 0;
      result = Math.floor(Math.random() * randomEnemyPositionArray.length);
      newResult = randomEnemyPositionArray[result];

      if (randomEnemyPositionArray.includes(randomEnemyPositionArray[result])) {
        randomEnemyPositionArray = randomEnemyPositionArray.filter((word) => word !== randomEnemyPositionArray[result]);
      }
      return newResult;
    }

    for (let i = 0; i < heroTeam.length; i++) {
      const char = new PositionedCharacter(heroTeam[i], randomHeroPosition());
      characters.push(char);
    }
    for (let i = 0; i < enemyTeam.length; i++) {
      const char = new PositionedCharacter(enemyTeam[i], randomEnemyPosition());
      characters.push(char);
    }

    this.gamePlay.redrawPositions(characters);

    this.characters = characters;
    this.addCellListeners();
  }

  addCellListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click

    const characterInCell = this.checkCharacterInCell(index);
    if (characterInCell && (characterInCell.character.type === 'Bowman' || characterInCell.character.type === 'Swordsman' || characterInCell.character.type === 'Magician')) {
      if (this.activeCharacter || this.activeCharacter === 0) {
        this.gamePlay.deselectCell(this.activeCharacter)
      }
      this.gamePlay.selectCell(index);
      this.activeCharacter = index;
      this.activeCharacterLast = characterInCell;
      this.canMove = 1;
    } 

    if (!characterInCell && this.canMove !== null) {
      this.gamePlay.deselectCell( this.activeCharacterLast.position)
      this.activeCharacterLast.position = index;
      this.canMove = null;
      this.gamePlay.redrawPositions(this.characters);
    }
      // GamePlay.showError('Сейчас должен быть ход игрока!') 
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const characterInCell = this.checkCharacterInCell(index);
    if (characterInCell) {
      this.gamePlay.showCellTooltip(`\u{1F396} ${characterInCell.character.level} \u{2694} ${characterInCell.character.attack} \u{1F6E1} ${characterInCell.character.defence} \u{2764} ${characterInCell.character.health}`, index);
      if ((characterInCell.character.type === 'Bowman' || characterInCell.character.type === 'Swordsman' || characterInCell.character.type === 'Magician')) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave

    const characterInCell = this.checkCharacterInCell(index);
    this.gamePlay.setCursor(cursors.auto);
    if (characterInCell) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  checkCharacterInCell(index) {
    return this.characters.find((item) => item.position === index);
  }
}
