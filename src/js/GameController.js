import themes from './themes';
import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';
import distance from './distance';
import NewFunctions from './newFunctions';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.turn = 1;
    this.gameState = new GameState();
    this.level = 0;
    this.switch = 1;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.startGame();
  }

  addCellListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  removeCellListeners() {
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.cellClickListeners = [];
  }

  startGame() {
    this.gamePlay.drawUi(themes.prairie);
    const heroPlayerTypes = [Bowman, Swordsman, Magician]; // доступные классы игрока
    const enemyPlayerTypes = [Vampire, Undead, Daemon]; // доступные классы игрока
    const characters = [];
    const heroCharacters = [];
    const enemyCharacters = [];
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
        randomHeroPositionArray = randomHeroPositionArray.filter(
          (word) => word !== randomHeroPositionArray[result],
        );
      }
      return newResult;
    }

    function randomEnemyPosition() {
      let result = 0;
      let newResult = 0;
      result = Math.floor(Math.random() * randomEnemyPositionArray.length);
      newResult = randomEnemyPositionArray[result];

      if (randomEnemyPositionArray.includes(
        randomEnemyPositionArray[result],
      )) {
        randomEnemyPositionArray = randomEnemyPositionArray.filter(
          (word) => word !== randomEnemyPositionArray[result],
        );
      }
      return newResult;
    }

    for (let i = 0; i < heroTeam.length; i = +1) {
      const char = new PositionedCharacter(heroTeam[i], randomHeroPosition());
      characters.push(char);
      heroCharacters.push(char);
    }
    for (let i = 0; i < enemyTeam.length; i = +1) {
      const char = new PositionedCharacter(enemyTeam[i], randomEnemyPosition());
      characters.push(char);
      enemyCharacters.push(char);
    }

    this.gamePlay.redrawPositions(characters);

    this.characters = characters;
    this.compTeam = enemyCharacters;
    this.userTeam = heroCharacters;
    this.addCellListeners();
  }

  newGame() {
    this.removeCellListeners();

    this.startGame();
  }

  saveGame() {
    this.gameState.saveDataGame(this);
    this.stateService.save(this.gameState);
    GamePlay.showError('Игра сохранена');
  }

  loadGame() {
    if (this.stateService.storage.length === 0) {
      GamePlay.showError('Нет сохраненной игры');
      return;
    }

    this.cleanGameProperty();
    const loadClass = this.stateService.load();
    this.userTeam = loadClass.gameData.userTeam;
    this.compTeam = loadClass.gameData.compTeam;
    this.loadGameUserTeam(this.userTeam);
    this.loadGameCompTeam(this.compTeam);
    this.userTeam = this.userCharacters;
    this.compTeam = this.compCharacters;

    this.level = loadClass.gameData.level;
    this.points = loadClass.gameData.points;
    this.gamePlay.drawUi(themes[this.setTheme()]);
    const ghostCharacters = [...this.userTeam, ...this.compTeam];

    ghostCharacters.forEach((item, index) => {
      this.characters.push(
        new PositionedCharacter(item, loadClass.gameData.characters[index].position),
      );
    });

    this.removeCellListeners();
    this.addCellListeners();
    this.gamePlay.redrawPositions(this.characters);
    this.userTeam = [];
    this.userCharacters.forEach((item, index) => {
      this.userTeam.push(
        new PositionedCharacter(item, loadClass.gameData.characters[index].position),
      );
    });

    this.compTeam = [];
    this.compCharacters.forEach((item, index) => {
      this.compTeam.push(
        new PositionedCharacter(item, loadClass.gameData.characters[index].position),
      );
    });
    GamePlay.showError('Игра загрузилась');
  }

  loadGameCompTeam(team) {
    this.compCharacters = [];
    for (let i = 0; i < team.length; i = +1) {
      const className = team[i].character.type[0].toUpperCase() + team[i].character.type.slice(1);
      const char = this.createClass(className, team[i].character.level);

      char.attack = team[i].character.attack;
      char.defence = team[i].character.defence;
      char.health = team[i].character.health;
      this.compCharacters.push(char);
    }
  }

  loadGameUserTeam(team) {
    this.userCharacters = [];
    for (let i = 0; i < team.length; i = +1) {
      const className = team[i].character.type[0].toUpperCase() + team[i].character.type.slice(1);
      const char = NewFunctions.createClass(className, team[i].character.level);

      char.attack = team[i].character.attack;
      char.defence = team[i].character.defence;
      char.health = team[i].character.health;
      this.userCharacters.push(char);
    }
  }

  cleanGameProperty() {
    this.level = 1;
    this.turn = true;
    this.points = 0;

    this.userTeam = new Team(null);
    this.compTeam = new Team(null);

    this.characters = [];
    this.activeCharacterLast = null;
    this.activeCharacter = null;

    this.canAttack = null;
    this.canMove = null;
  }

  onCellClick(index) {
    // TODO: react to click

    if (this.notAllowed) {
      throw new Error('Недопустимое действие');
    }

    const characterInCell = this.checkCharacterInCell(index);
    if (characterInCell && (characterInCell.character.type === 'bowman' || characterInCell.character.type === 'swordsman' || characterInCell.character.type === 'magician')) {
      if (this.activeCharacter || this.activeCharacter === 0) {
        this.gamePlay.deselectCell(this.activeCharacter);
      }
      this.gamePlay.selectCell(index);
      this.activeCharacter = index;
      this.activeCharacterLast = characterInCell;
      this.canMove = 1;
    }

    if (!characterInCell && this.canMove !== null) {
      this.gamePlay.deselectCell(this.activeCharacterLast.position);
      this.activeCharacterLast.position = index;
      this.canMove = null;
      this.gamePlay.deselectCell(index);
      this.gamePlay.redrawPositions(this.characters);
      this.turn = false;
      this.enemyTurn();
    }

    if (characterInCell && this.canMove && (characterInCell.character.type === 'undead' || characterInCell.character.type === 'daemon' || characterInCell.character.type === 'vampire')) {
      const damage = Math.max(
        this.activeCharacterLast.character.attack - characterInCell.character.defence,
        this.activeCharacterLast.character.attack * 0.1,
      );
      (async () => {
        await this.gamePlay.showDamage(index, damage);

        if (characterInCell.character.health <= 0) {
          this.death(this.compTeam, characterInCell);
        }

        if (this.compTeam.length < 1) {
          this.nextLevel();
        }
        this.gamePlay.redrawPositions(this.characters);

        this.turn = false;
        this.enemyTurn();
      })();
      characterInCell.character.health -= damage;
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const characterInCell = this.checkCharacterInCell(index);
    if (characterInCell) {
      this.gamePlay.showCellTooltip(`\u{1F396} ${characterInCell.character.level} \u{2694} ${characterInCell.character.attack} \u{1F6E1} ${characterInCell.character.defence} \u{2764} ${characterInCell.character.health}`, index);
      if ((characterInCell.character.type === 'bowman' || characterInCell.character.type === 'swordsman' || characterInCell.character.type === 'magician')) {
        this.gamePlay.setCursor(cursors.pointer);
        this.notAllowed = false;
      }
    }

    if (!characterInCell && this.canMove) {
      const range = distance(this.activeCharacterLast, this.activeCharacter, 'move');
      range.forEach((element) => {
        if (element === index) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
          this.notAllowed = false;
        }
      });

      if (!range.includes(index)) {
        this.gamePlay.setCursor(cursors.notallowed);
        this.notAllowed = true;
      }
    }

    if (characterInCell && this.canMove && (characterInCell.character.type === 'undead' || characterInCell.character.type === 'daemon' || characterInCell.character.type === 'vampire')) {
      const range = distance(this.activeCharacterLast, this.activeCharacter, 'attack');
      range.forEach((element) => {
        if (element === index) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.notAllowed = false;
        }
      });

      if (!range.includes(index)) {
        this.gamePlay.setCursor(cursors.notallowed);
        this.notAllowed = true;
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave

    const characterInCell = this.checkCharacterInCell(index);
    this.gamePlay.setCursor(cursors.auto);

    if (this.activeCharacterLast && this.activeCharacterLast.position !== index) {
      this.gamePlay.deselectCell(index);
    }

    if (characterInCell) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  checkCharacterInCell(index) {
    return this.characters.find((item) => item.position === index);
  }

  enemyTurn() {
    let activeCompCharacter = null;
    let willBeAttacked = null;

    this.compTeam.find((compChar) => {
      const posChar = this.characters.find((char) => char.character === compChar.character);

      const rangeAttack = distance(posChar, posChar.position, 'attack');

      rangeAttack.find((itemIndex) => {
        const characterInCell = this.checkCharacterInCell(itemIndex);

        if (characterInCell && NewFunctions.isPlayableCharacter(characterInCell)) {
          willBeAttacked = characterInCell;
          return willBeAttacked;
        }
        return false;
      });

      if (willBeAttacked) {
        activeCompCharacter = posChar;

        this.gamePlay.selectCell(activeCompCharacter.position);
        this.gamePlay.selectCell(willBeAttacked.position, 'red');

        const damage = +(Math.max(
          activeCompCharacter.character.attack - willBeAttacked.character.defence,
          activeCompCharacter.character.attack * 0.1,
        )).toFixed(1);
        willBeAttacked.character.health -= damage;
        willBeAttacked.character.health = +(willBeAttacked.character.health).toFixed(1);

        (async () => {
          await this.gamePlay.showDamage(willBeAttacked.position, damage);

          this.gamePlay.deselectCell(activeCompCharacter.position);
          this.gamePlay.deselectCell(willBeAttacked.position);

          if (willBeAttacked.character.health <= 0) {
            this.death(this.userTeam, willBeAttacked);
          }

          this.gamePlay.redrawPositions(this.characters);
          this.turn = true;

          if (this.userTeam.length === 0) {
            setTimeout(() => {
              GamePlay.showError('Игра окончена!');
              this.removeCellListeners();
            }, 100);
          }
        })();

        return activeCompCharacter;
      }
      return false;
    });

    if (activeCompCharacter) return;

    activeCompCharacter = this.strongCharacter(this.compTeam);

    const rangeMove = distance(activeCompCharacter, activeCompCharacter.position, 'move');

    rangeMove.forEach((item, index, array) => {
      const filledCell = this.checkCharacterInCell(item);
      if (filledCell) {
        array.splice(index, 1);
      }
    });

    const rangeAttackUser = new Set();

    this.userTeam.find((userChar) => {
      const posChar = this.characters.find((char) => char.character === userChar.character);
      const range = distance(activeCompCharacter, posChar.position, 'attack');

      range.forEach((item) => {
        rangeAttackUser.add(item);
      });
      return false;
    });

    const cellCanMove = [];

    NewFunctions.compMoveRange(rangeAttackUser, rangeMove, cellCanMove);

    if (cellCanMove.length === 0) {
      rangeAttackUser.forEach((item) => {
        this.userTeam.forEach(() => {
          const range = distance(activeCompCharacter, item, 'attack');

          range.forEach((itemCell) => {
            rangeAttackUser.add(itemCell);
          });
        });
      });

      NewFunctions.compMoveRange(rangeAttackUser, rangeMove, cellCanMove);
    }

    [activeCompCharacter.position] = cellCanMove;
    this.gamePlay.redrawPositions(this.characters);
    this.turn = true;
  }

  death(team, posCharacter) {
    team.forEach((item, index, array) => {
      if (item === posCharacter.character) {
        array.splice(index, 1);
      }
    });
    this.characters.forEach((item, index, array) => {
      if (item.character === posCharacter.character) {
        array.splice(index, 1);
      }
    });

    this.userTeam.forEach((item, index, array) => {
      if (item.character === posCharacter.character) {
        array.splice(index, 1);
      }
    });
    this.compTeam.forEach((item, index, array) => {
      if (item.character === posCharacter.character) {
        array.splice(index, 1);
      }
    });
  }

  strongCharacter(characters) {
    const arr = characters;

    if (arr.length > 1) {
      arr.sort((a, b) => {
        if (a.character.attack < b.character.attack) {
          return 1;
        }
        if (a.character.attack > b.character.attack) {
          return -1;
        }
        return 0;
      });
    }
    const result = this.characters.find((item) => item.character === arr[0].character);
    return result;
  }

  nextLevel() {
    this.userTeam.forEach((item) => {
      NewFunctions.levelUp(item);
    });
    this.level += 1;
    this.gamePlay.drawUi(themes[this.setTheme()]);
    this.characters = [];
    this.setCharactersArr();
    this.gamePlay.redrawPositions(this.characters);
    this.removeCellListeners();
    this.addCellListeners();
  }

  setTheme() {
    if (this.level === 0) {
      return 'prairie';
    }

    if (this.level === 1) {
      return 'desert';
    }

    if (this.level === 2) {
      return 'arctic';
    }

    if (this.level === 3) {
      return 'mountain';
    }

    if (this.level === 4) {
      alert('Вы победили!');
      this.removeCellListeners();
      return 'mountain';
    }

    return 'prairie';
  }

  setCharactersArr() {
    const enemyPlayerTypes = [Vampire, Undead, Daemon];
    const characters = [];
    const enemyCharacters = [];
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

      if (randomHeroPositionArray.includes(
        randomHeroPositionArray[result],
      )
      ) {
        randomHeroPositionArray = randomHeroPositionArray.filter(
          (word) => word !== randomHeroPositionArray[result],
        );
      }
      return newResult;
    }

    function randomEnemyPosition() {
      let result = 0;
      let newResult = 0;
      result = Math.floor(Math.random() * randomEnemyPositionArray.length);
      newResult = randomEnemyPositionArray[result];

      if (randomEnemyPositionArray.includes(
        randomEnemyPositionArray[result],
      )) {
        randomEnemyPositionArray = randomEnemyPositionArray.filter(
          (word) => word !== randomEnemyPositionArray[result],
        );
      }
      return newResult;
    }

    for (let i = 0; i < this.userTeam.length; i = +1) {
      const char = new PositionedCharacter(this.userTeam[i].character, randomHeroPosition());
      characters.push(char);
    }

    for (let i = 0; i < enemyTeam.length; i = +1) {
      const char = new PositionedCharacter(enemyTeam[i], randomEnemyPosition());
      characters.push(char);
      enemyCharacters.push(char);
    }

    this.characters = characters;
    this.compTeam = enemyCharacters;
  }
}
