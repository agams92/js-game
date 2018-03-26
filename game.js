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
    }
    get type(){
        return 'actor';
    }
    get left() {
        return this.pos.x;
    }
    get right() {
        return this.size.x + this.pos.x;
    }
    get top(){
        return this.pos.y;
    }
    get bottom(){
        return this.size.y + this.pos.y;
    }
    act(){};
    
    isIntersect(check) {
        if(!(check instanceof Actor) || check === null) {
            throw new Error('Неправильный аргумент')
        }
        if(check === this) {
            return false;
        }
        return this.left < check.right && check.left < this.right && check.top < this.bottom && this.top < check.bottom;
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
    removeActor(toRemove) {
        this.actors.splice(this.actors.findIndex((el) => el === toRemove),1);
    }
}


class Player extends Actor {
    constructor(){
        super(...arguments);
        this.typeName = 'player';
    }
}
