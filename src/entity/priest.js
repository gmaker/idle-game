class Priest extends Raider {
    constructor(game){
        super(game);
        this.health = this.maxHealth = 10;
        this.castTime = 0;
        this.showSp = true;
    }

    tick(){
        if (this.castTime > 0) this.castTime--;
        super.tick();
        var index = -1;
        var min = 0;
        for (var i = 0; i < this.level.raiders.length; i++) {
            var r = this.level.raiders[i];
            var hp = r.health / r.maxHealth;
            if (hp < min || index == -1) {
                index = i;
                min = hp;
            }
        }
        this.target = this.level.raiders[index];

        var xd = this.target.x - this.x;
        var yd = this.target.y - this.y;
        var l = Math.sqrt(xd * xd + yd * yd);
        if (l > 64){
            this.xa += xd / l * this.movementSpeed;
            this.ya += yd / l * this.movementSpeed;
        } else {
            if (this.target.health < this.target.maxHealth) {
                this.castHeal(this.target);
            }
        }
        var r = 2;
        var list = this.level.getEntities(this.x - r, this.y - r, this.x + r, this.y + r);
        if (list.length > 1) {
            this.xa += (Math.random() * 2.0 - 1.0) * 0.03;
            this.ya += (Math.random() * 2.0 - 1.0) * 0.03;
        }
    }

    castHeal(target) {
        if (this.castTime > 0) return;
        if (this.sp >= 10) {
            this.sp -= 10;
            target.heal(this, 3);
            this.castTime = 120;
        }
    }

    findStartPos(level) {
        while(true) {
            var x = (Math.random() * 1) | 0;
            var y = (Math.random() * level.h) | 0;
            var xx = (x << 4) + 8;
            var yy = (y << 4) + 8;

            if (!level.getTile(x, y).mayPass(level, x, y, this)) return false;

            this.x = xx;
            this.y = yy;

            return true;
        }
    }

    render(sprites, alpha, time) {
        super.render(sprites, alpha, time);
        if (this.hurtTime > 0 && this.hurtTime / 4 % 2 == 0)return;
        sprites.add(new Sprite(this.x - 8, this.y - 8, 16, 16, 0, 32, Color.getABCD(222, 0, -1, 111)));
    }

}