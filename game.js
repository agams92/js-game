'use strict';
/*------Конструктор вектора-------*/
class Vector {
    constructor(x = 0,y = 0) {
        this.x = x;
        this.y = y;
    }
    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Можно прибавлять к вектору только вектор типа Vector');
        } else {
            return new Vector(this.x + vector.x,this.y + vector.y);
        }
    }
    times(multiplier) {
        return new Vector(this.x * multiplier,this.y * multiplier);
    }
}

/*------Конструктор движущегося объекта-------*/
class Actor {
    constructor(pos = new Vector(0,0),size = new Vector(1,1),speed = new Vector(0,0)) {
        this.pos = pos;
        this.size = size;
        this.speed = speed;
        if(!(this.pos instanceof Vector) || !(this.size instanceof Vector) || !(this.speed instanceof Vector)) {
            throw new Error ('Аргумент не является вектором типа Vector');
        }
    }

    get type() {
        return 'actor';
    }
    get left() {
        return this.pos.x;
    }
    get right() {
        return this.size.x + this.pos.x;
    }
    get top() {
        return this.pos.y;
    }
    get bottom() {
        return this.size.y + this.pos.y;
    }

    act() {}

    isIntersect(objToCheck) {
        if(!(objToCheck instanceof Actor) || objToCheck === null) {
            throw new Error('Неправильный аргумент');
        } else if(objToCheck === this) {
            return false;
        } else {
            return this.left < objToCheck.right && objToCheck.left < this.right && objToCheck.top < this.bottom && this.top < objToCheck.bottom;
        }
    }
}

/*------Конструктор свойств уровня-------*/
class Level {
    constructor(grid = [],actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.height = grid.length;
        if (grid.length === 0) {
            this.width = 0;
        } else {
            this.width = Math.max.apply(Math,grid.map((el => el.length)));
        }
        this.player = actors.find((el) => el.type === 'player');
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished(){
        if(this.status !== null && this.finishDelay < 0 ) {
            return true;
        } else {
            return false;
        }
    }

    actorAt(actor) {
        if (actor === undefined || !(actor instanceof Actor)) {
            throw new Error('Неправильный аргумент');
        } else if (this.actors.length === 0 || this.actors.length === 1) {
            return undefined;
        } else {
            return this.actors.find((el) => el.isIntersect(actor));
        }
    }

    obstacleAt(objPos,objSize) {
        if (!(objPos instanceof Vector) && !(objSize instanceof Vector)) {
            throw new Error('Неправильные аргументы');
        }
        let obj = new Actor(objPos,objSize);
        if (obj.left < 0 || obj.right > this.width || obj.top < 0) {
            return 'wall';
        } else if (obj.bottom > this.height) {
            return 'lava';
        }
        for (let row = Math.floor(obj.top); row < obj.bottom; row++){
        	for (let column = Math.floor(obj.left); column < obj.right; column++) {
        		if(this.grid[row][column] === 'wall' || this.grid[row][column] === 'lava') {
        			return this.grid[row][column];
        		}
        	}
        }
    }

    removeActor(toRemove) {
        this.actors.splice(this.actors.findIndex((el) => el === toRemove),1);
    }

    noMoreActors(actorTypeToCheck) {
        return this.actors.findIndex((el) => el.type === actorTypeToCheck) === -1;
    }

    playerTouched(objType,obj = new Actor()) {
        if (this.status !== null) {
            return 'Game over';
        } else if (objType === 'lava' || objType === 'fireball') {
            this.status = 'lost';
        } else if (objType === 'coin' && obj.type === 'coin') {
            this.removeActor(obj);
            if (this.noMoreActors(objType)) {
                this.status = 'won';
            }
        }
    }
}

/*------Конструктор самого уровня-------*/
class LevelParser {
    constructor(symbolsList){
        this.symbolsList = symbolsList;
    }

    actorFromSymbol(symbol) {
        if (symbol === undefined) {
            return symbol;
        } else {
            return this.symbolsList[`${symbol}`];
        }
    }

    obstacleFromSymbol(symbol) {
        if (symbol === 'x') {
            return 'wall';
        } else if (symbol === '!') {
            return 'lava';
        } else {
            return undefined;
        }
    }

    createGrid(gridPlan) {
        return gridPlan.map((item) => {
            return item.split('').map((el) => this.obstacleFromSymbol(el));
        })
    }

    createActors(toActors) {
        let result = [];
        /*if (this.symbolsList !== undefined) {
            toActors.forEach((row,rowIndex) => {
                row.split('').forEach((column,columnIndex) => {
                    let actorConstructor = this.actorFromSymbol(column);
                    if (actorConstructor !== undefined && typeof(actorConstructor) == 'function') {
                        let actor = new actorConstructor(new Vector(columnIndex,rowIndex));
                        if (actor instanceof Actor) {
                            result.push(actor);
                        }
                    }
                });
            });
        }*/
        if (this.symbolsList !== undefined) {
            return toActors.map((row,rowIndex) => {
                return row.split('').map((column,columnIndex) => {
                    /*let actorConstructor = this.actorFromSymbol(column);
                    if (actorConstructor !== undefined && typeof(actorConstructor) == 'function') {
                        let actor = new actorConstructor(new Vector(columnIndex,rowIndex));
                        if (actor instanceof Actor) {
                            return actor;
                        }
                    }*/
                    return column
                })
            })
        }
        //return result;
    }
    parse(level){
        let grid = this.createGrid(level);
        let actors = this.createActors(level);
        return new Level(grid,actors);
    }
}

let Gift, Mushroom;
const parser1 = new LevelParser({ o: Actor, z: Mushroom });
const actors1 = parser1.createActors(['hgog', '@hgjgzh']);
console.log(actors1)

/*------Конструктор базовой шаровой молнии-------*/
class Fireball extends Actor {
    constructor(pos = new Vector(0,0),speed = new Vector(0,0)){
        super(...arguments);
        this.pos = pos;
        this.speed = speed;
        this.size = new Vector(1,1);
    }
    get type() {
        return 'fireball';
    }

    getNextPosition(time = 1){
        let nextPos = this.pos.plus(this.speed.times(time));
        return new Vector(nextPos.x,nextPos.y);
    }

    handleObstacle() {
        this.speed = this.speed.times(-1);
    }

    act(time,level) {
        let nextPos = this.getNextPosition(time);
        if(level.obstacleAt(nextPos,this.size) === 'wall' || level.obstacleAt(nextPos,this.size) === 'lava') {
            this.handleObstacle();
        } else {
            this.pos = nextPos;
        }
    }
}

/*------Конструкторы горизонтальной, вертикальной шаровой молнии-------*/
class HorizontalFireball extends Fireball {
    constructor(pos) {
        super(...arguments);
        this.speed = new Vector(2,0);
    }
}

class VerticalFireball extends Fireball {
    constructor(pos) {
        super(...arguments);
        this.speed = new Vector(0,2);
    }
}

/*------Конструктор огненного дождя-------*/
class FireRain extends Fireball {
    constructor(pos){
        super(...arguments);
        this.speed = new Vector(0,3);
        this.initialPos = pos;
    }

    handleObstacle(){
        this.pos = this.initialPos;
    }
}

/*------Конструктор монеты-------*/
class Coin extends Actor {
    constructor(pos = new Vector(0,0)){
        super(...arguments);
        this.pos = pos.plus(new Vector(0.2,0.1));
        this.startPos = pos.plus(new Vector(0.2,0.1));
        this.size = new Vector(0.6,0.6);
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random() * (Math.PI * 2);
    }

    get type() {
        return 'coin';
    }

    updateSpring(time = 1) {
        this.spring = this.spring + (this.springSpeed * time);
    }

    getSpringVector() {
        let y = Math.sin(this.spring) * 0.07;
        return new Vector(0,y);
    }

    getNextPosition(time = 1) {
        this.spring += this.springSpeed * time;
        let nextPos = this.startPos.plus(this.getSpringVector());
        return nextPos;
    }

    act (time){
        this.pos = this.getNextPosition(time);
    }
}

/*------Конструктор игрока-------*/
class Player extends Actor {
    constructor(pos = new Vector(0,0)){
        super(...arguments);
        this.pos = pos.plus(new Vector(0,-0.5));
        this.size = new Vector(0.8,1.5);
    }

    get type() {
        return 'player';
    }
}

/*------Игра-------*/

  const schemas = [
    [
      '         ',
      '         ',
      '    =    ',
      '       o ',
      '     !xxx',
      ' @       ',
      'xxx!     ',
      '         '
    ],
    [
      '      v  ',
      '    v    ',
      '  v      ',
      '        o',
      '        x',
      '@   x    ',
      'x        ',
      '         '
    ],
    [
    '  |   v       ',
    '     =      o ',
    '         xxxxx',
    '              ',
    'xxxx          ',
    '             o',
    '@        xxxxx',
    'xxxxx!!!!!!!!!'
      ]
  ];
  const actorDict = {
    '@': Player,
    'v': FireRain,
    '=': HorizontalFireball,
    'o': Coin,
    '|': VerticalFireball
  }
  const parser = new LevelParser(actorDict);
  //runGame(schemas, parser, DOMDisplay)
   // .then(() => alert('Вы прошли игру!'));