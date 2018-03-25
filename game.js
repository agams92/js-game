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
        Object.defineProperty(this,'type',{
            writable: false,
            enumerable: true,
            value: 'actor'
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
        if (this.left <= check.right && check.left <= this.right && check.top <= this.bottom && check.top <= this.bottom) {
            return true;
        }
        if (check.right === this.left || check.left === this.right) {
            if (this.top >= check.top && this.top <= check.bottom) {
                return true
            }
            else if (this.bottom >= check.top && this.bottom <= check.bottom){
                return true
            }
        } 
        if (check.top === this.bottom || check.bottom === this.top) {
            if (this.left >= check.left && this.left <= check.right) {
                return true
            } 
            else if (this.right >= check.left && this.right <= check.right) {
                return true
            }
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
        this.player = actors.findIndex((el) => el.type == 'player');
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
}

let grid = [[1,2,3,4], [1,2,3,4],[1,2,3,4]]
let player = new Actor(new Vector(0,0),new Vector(1,1));
let mushroom = new Actor(new Vector (3,3),new Vector(1,1));
const level = new Level(grid, [ player, mushroom ]);
const actor = level.actorAt(player);
console.log(actor)


