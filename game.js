'use strict';
class Vector {
    constructor(x = 0,y = 0) {
        this.x = x;
        this.y = y;
    }
    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Можно прибавлять к вектору только вектор типа Vector');
        }
        else {
            this.x += vector.x;
            this.y += vector.y;
            return new Vector(this.x,this.y);
        }
    }
    times(multiplier) {
        this.x *= multiplier;
        this.y *= multiplier;
        return new Vector(this.x,this.y);
    }
}

class Actor {
    constructor(pos = new Vector(0,0),size = new Vector(1,1),speed = new Vector(0,0)) {
        this.pos = pos;
        this.size = size;
        this.speed = speed;
        if(!(this.pos instanceof Vector) || !(this.size instanceof Vector) || !(this.speed instanceof Vector)) {
            throw new Error ('Аргумент не является вектором типа Vector')
        }
        this.typeName = 'actor';
        Object.defineProperty(this,'type',{
            get() {
                return this.typeName;
            }
        })
        Object.defineProperty(this,'left',{
            writable: false,
            value: pos.x
        })
        Object.defineProperty(this,'right',{
            writable: false,
            value: size.x + pos.x
        })
        Object.defineProperty(this,'top',{
            writable: false,
            value: pos.y
        })
        Object.defineProperty(this,'bottom',{
            writable: false,
            value: size.y + pos.y
        })
    }
    act(){};
    
    isIntersect(check) {
        if(!(check instanceof Actor) || check === null) {
            throw new Error('Неправильный аргумент')
        }
        if(check === this) {
            return false;
        }
        if (this.left < check.right && check.left < this.right && check.top < this.bottom && this.top < check.bottom) {
            return true;
        } 
        else {
            return false;
        }
    }
}

class Level {
    constructor(grid = [],actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.height = grid.length;
        if (grid.length === 0) {
            this.width = 0;
        } else {
            this.width = Math.max.apply(Math,grid.map((el => el.length)));;
        }
        this.player = actors.find((el) => el.type === 'player');
        this.status = null;
        this.finishDelay = 1;
    }
    isFinished(){
        if(this.status != null && this.finishDelay < 0 ) {
            return true;
        } else {
            return false;
        }
    }
    actorAt(actor) {
        if (actor === undefined || !(actor instanceof Actor)) {
            throw new Error('Неправильный аргумент') 
        } else if (this.length === 0 || this.actors.length === 1) {
           return undefined;
        } else {
        return this.actors.find((el) => el.isIntersect(actor) === true)
        }
    }
    obstacleAt(objPos,objSize) {
        if (!(objPos instanceof Vector) && !(objSize instanceof Vector)) {
            throw new Error('Неправильные аргументы')
        }
        let obj = new Actor(objPos,objSize);
        if (obj.left < 0 || obj.right > this.width || obj.top < 0) {
            return 'wall';
        } else if (obj.bottom > this.height) {
            return 'lava';
        }
        let a;
        for (let i = Math.floor(obj.top); i < obj.bottom; i++){
            a = this.grid[i].findIndex((el) => el === 'wall' || el === 'lava');
            if (a >= Math.floor(obj.left) && a < obj.right) {
                return this.grid[i][a];
            }
        }
    }
}


class Player extends Actor {
    constructor(){
        super(...arguments);
        this.typeName = 'player';
    }
}
const gridSize = 2;
let wallGrid = new Array(gridSize).fill(new Array(gridSize).fill('wall'));
const level = new Level(wallGrid);
const position = new Vector(0, 0);
const size = new Vector(0.5, 0.5);
const wall = level.obstacleAt(position, size);
console.log(wall)



/*//Проверка на смежные границы - третий элемент возвращает true, т.к. находится внутри player
let position = new Vector(30, 50);
let size = new Vector(5, 5);
const player = new Actor(position, size);
const moveX = new Vector(1, 0);
const moveY = new Vector(0, 1);
const coins = [
  new Actor(position.plus(moveX.times(-1))),
  new Actor(position.plus(moveY.times(-1))),
  new Actor(position.plus(size).plus(moveX)),
  new Actor(position.plus(size).plus(moveY))
];

coins.forEach(coin => {
  const notIntersected = player.isIntersect(coin);
  console.log(notIntersected)
  console.log('C' + coin.left, coin.right,coin.top,coin.bottom)
  console.log('P' + player.left, player.right,player.top,player.bottom)
});

//Проверка на то, что у класса Level есть свойство player, в котором лежит объект со свойством type, равным player. Здесь все получается, однако в тестовом файле код возвращает undefined
let grid = [[1,2,3,4], [1,2,3,4],[1,2,3,4]]
let player = new Player(new Vector(0,0),new Vector(1,1));
let mushroom = new Actor(new Vector (3,3),new Vector(1,1));
const level = new Level(grid, [ player, mushroom ]);
console.log(level.player === player) 
*/