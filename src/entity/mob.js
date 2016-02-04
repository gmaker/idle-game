class Mob extends Entity {
    tick(){
        super.tick();
        if (this.target == null) {
            var r = 128;
            var entities = this.level.getEntities(this.x - r, this.y - r, this.x + r, this.y + r);
            for(var i = 0; i < entities.length; i++) {
                var e = entities[i];
                if (!(e instanceof Mob)) {
                    this.target = e;
                    break;
                }
            }
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

    render(sprites, alpha, time) {
        super.render(sprites, alpha, time);
        if (this.hurtTime > 0 && (this.hurtTime / 4 | 0) % 2 == 0)return;
        sprites.add(new Sprite(this.x - 8, this.y - 8, 16, 16, 0, 48, Color.getABCD(410, 444, -1, 333)));
    }
}