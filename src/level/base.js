class Base extends Map {
    constructor(game) {
        super(4, 4, "Base");
        this.game = game;
        for(var i = 0; i < this.w * this.h; i++) {
            this.tiles[i] = grassTile.id;
        }
        this.hpRegen = 0.001;
        this.spRegen = 0.05;
    }

    tick() {
        super.tick();
        var canFarm = true;
        this.raiders.forEach(r => {
            if (r.health != r.maxHealth || r.sp != r.maxSp) {
                canFarm = false;
            }
        });

        if (canFarm){
            this.raiders.forEach(r => {
                this.game.moveRaiderTo(r, this, this.game.level);
            });

        }
    }
}