var IDs = 0;
class Entity {
    constructor() {
        this.id = ++IDs;
        this.x = 0;
        this.y = 0;
        this.xa = 0;
        this.ya = 0;
        this.xr = 6;
        this.yr = 6;
        this.removed = false;
        this.level = null;
        this.movementSpeed = 0.02;
        this.health = this.maxHealth = 5;
        this.sp = this.maxSp = 100;
        this.spRegen = 0.05;
        this.hpRegen = 0;
        this.hurtTime = 0;
        this.immortal = false;
        this.showSp = false;
    }

    init(level) {
        this.level = level;
    }

    heal(e, heal) {
        this.health += heal;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }

    regen() {
        this.health += this.hpRegen + this.level.hpRegen;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
        this.sp += this.spRegen + this.level.spRegen;
        if (this.sp > this.maxSp) this.sp = this.maxSp;
        var a = 10;
    }

    hurt(e) {
        if (this.immortal) return;
        if (this.hurtTime > 0) return;
        this.hurtTime = 30;
        if (--this.health < 0) {
            this.die();
        }
    }

    die() {
        this.removed = true;
    }

    tick() {
        this.regen();
        if (this.hurtTime > 0) this.hurtTime--;
        this.x += this.xa;
        this.y += this.ya;
        this.xa *= 0.96;
        this.ya *= 0.96;
    }

    findStartPos(level) {
        var x = (Math.random() * level.w) | 0;
        var y = (Math.random() * level.h) | 0;
        var xx = (x << 4) + 8;
        var yy = (y << 4) + 8;

        var r = level.monsterDensity * 16.0;
        if (level.getEntities(xx - r, yy - r, xx + r, yy + r).length > 0) return false;

        if (!level.getTile(x, y).mayPass(level, x, y, this)) return false;

        this.x = xx;
        this.y = yy;

        return true;
    }

    intersects(x0, y0, x1, y1) {
        return !(this.x + this.xr < x0 || this.y + this.yr < y0 || this.x - this.xr > x1 || this.y - this.yr > y1)
    }

    distTo(e) {
        var xd = this.x - e.x;
        var yd = this.y - e.y;
        return Math.sqrt(xd * xd + yd * yd);
    }

    render(sprites, alpha, time) {
        var c = 8;
        var w = 2;
        var h = 1;
        var hp = this.health / this.maxHealth;
        for (var i = 0; i < c; i++) {
            var ip = i / c;
            var x = i * w + this.x - 8;
            var y = this.y - 10;
            var col = ip > hp ? 500 : 50;
            sprites.add(new Sprite(x, y, w, h, 0, 0, Color.getABCD(0, 0, col, 0)));
            if (this.showSp) {
                var sp = this.sp / this.maxSp;
                y = this.y - 10 + h;
                col = ip > sp ? 333 : 5;
                sprites.add(new Sprite(x, y, w, h, 0, 0, Color.getABCD(0, 0, col, 0)));
            }
        }
    }
}