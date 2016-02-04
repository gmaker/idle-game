class Level extends Map {
    constructor(w, h, name, level) {
        super(w, h, name);
        this.level = level;
        this.monsterDensity -= level * 0.1;
        this.diedMonsters = 0;
        this.monstersToNextLevel = 2 + level * level;
        this.nextLevelLock = true;
        this.grassColors = [
            141,
            131,
            121,
            111
        ];

        this.dirtColors = [
            550,
            440,
            330,
            220
        ];
        this.grassColor = this.grassColors[Mth.clamp(level, 0, this.grassColors.length - 1)];
        this.dirtColor = this.dirtColors[Mth.clamp(level, 0, this.dirtColors.length - 1)];
    }

    monsterHasDied(e) {
        if (++this.diedMonsters >= this.monstersToNextLevel > 0 && this.nextLevelLock) {
            this.nextLevelLock = false;
            for(var y = 0; y < this.h; y++) {
                this.tiles[(this.w - 1) + y * this.w] = nextLevelTile.id;
            }
        }
    }

    trySpawn(count) {
        for(var i = 0; i < count; i++) {
            var mob = new Mob();
            if (mob.findStartPos(this)) {
                this.addEntity(mob);
            }
        }
    }

    tick() {
        this.trySpawn(1);
        super.tick();
    }

}