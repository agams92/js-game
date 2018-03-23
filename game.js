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
        if (this.left <= (check.left || check.right)) {
            if (this.right >= (check.left || check.right)) {
                if (this.top <= (check.top || check.bottom)) {
                    if (this.bottom >= (check.top || check.bottom)) {
                        return true;
                    }
                }
            }
        }
        else {
            return false;
        }
        
    }
    
}
