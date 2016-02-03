class Knight extends Raider {
    constructor(game){
        super(game);
        this.health = this.maxHealth = 10;
    }

    tick(){
        super.tick();
        if (this.target == null) {
            var r = 320 * (this.health / this.maxHealth);
            this.target = this.level.getNearEntity(this, this.x - r, this.y - r, this.x + r, this.y + r, (e) => {
                return e instanceof Mob;
            })
        }

        if (this.target != null) {
            var xd = this.target.x - this.x;
            var yd = this.target.y - this.y;
            var l = Math.sqrt(xd * xd + yd * yd);
            if (l > 32){
                this.xa += xd / l * this.movementSpeed;
                this.ya += yd / l * this.movementSpeed;
            } else {
                this.target.hurt(this);
            }

            if (this.target.removed || this.level != this.target.level) this.target = null;
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
        sprites.add(new Sprite(this.x - 8, this.y - 8, 16, 16, 0, 32, Color.getABCD(421, 555, -1, 210)));
    }

}