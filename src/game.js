class Game {
    constructor(input) {
        this.input = input;
        this.spritesProgramInfo = twgl.createProgramInfo(gl, ["sprite_vs", "sprite_fs"]);
        this.texture = new Texture("resources/sheet.png");
        this.palette = Texture.getPalette();
        this.sprites = new Sprites();
        this.sprites.setTexture(this.texture, this.palette);
        this.sprites.setProgram(this.spritesProgramInfo);

        this.base = new Base(this);
        this.baseOffset = (this.base.w << 4) + 64;

        this.xScroll = 0;
        this.yScroll = 0;
        this.raiders = [new Knight(this), new Priest(this)];

        this.levels = [
            new Level(32, 16, "Back yard", 0),
            new Level(32, 16, "Woods", 1),
            new Level(32, 16, "Lakes", 2),
            new Level(32, 16, "LakesAA", 3),

        ];
        this.currentLevel = 0;
        this.level = this.levels[this.currentLevel];
        this.levels.forEach(l => l.trySpawn(1000));
        this.raiders.forEach(r => this.moveRaiderTo(r, null, this.level));
        this.xm = 0;
        this.ym = 0;
        this.cursor = 1;
        this.cursorABCDs = [
                        Color.getABCD(555, 55, -1, 0), //cursor
                        Color.getABCD(555, 541, -1, 0), //hands
                        Color.getABCD(555, 511, -1, 0), //arrow
                    ];

        this.pendingLevelChange = 0;
    }

    tick() {
        this.input.tick();

        if (this.pendingLevelChange != 0) {
            this.changeLevel(this.pendingLevelChange);
            this.pendingLevelChange = 0;
        }

        if (this.input.dragging) {
            this.xScroll += this.input.xDragA / SCALE ;
            this.yScroll += this.input.yDragA / SCALE ;
            var offsetLimit = 100;
            this.xScroll = Mth.clamp(this.xScroll, -(offsetLimit + this.baseOffset), (this.level.w << 4) - (WIDTH / SCALE | 0) + offsetLimit) | 0;
            this.yScroll = Mth.clamp(this.yScroll, -offsetLimit, (this.level.h << 4) - (HEIGHT / SCALE | 0) + offsetLimit) | 0;
        }

        this.level.tick();
        this.base.tick();

        this.raiders.forEach(r => {
            if (r.wasDie) this.moveRaiderTo(r, r.level, this.base);
        })

        this.xm = this.input.x / SCALE | 0;
        this.ym = this.input.y / SCALE | 0;

        var xxm = (this.xm + this.xScroll) | 0;
        var yym = (this.ym + this.yScroll) | 0;

        var xmt = xxm >> 4;
        var ymt = yym >> 4;

        this.cursor = 1;

        var mr = 2;
        if (this.level.getEntities(xxm - mr, yym - mr, xxm + mr, yym + mr).length > 0) {
            this.cursor = 0;
        }

        if (this.level.getTile(xmt, ymt) == nextLevelTile) {
            this.cursor = 2;
            if (this.input.m0Clicked) {
                this.scheduleLevelChange(1);
            }
        }
    }

    moveRaiderTo(e, from, to) {
        if (from == to) return;
        e.wasDie = false;
        if (from != null) {
            from.removeEntity(e);
        }
        e.findStartPos(to);
        to.addEntity(e);
    }

    changeLevel(dir) {
        this.raiders.forEach(r => {
            this.moveRaiderTo(r, this.level, this.base);
        });
        this.currentLevel = Mth.clamp(this.currentLevel + dir, 0, this.levels.length - 1);
        this.level = this.levels[this.currentLevel];
    }

    scheduleLevelChange(dir) {
        this.pendingLevelChange = dir;
    }


    render(alpha, time) {
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.viewMatrix = m4.ortho(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, -1, 1);
        m4.scale(this.viewMatrix, v3.create(SCALE, SCALE, SCALE), this.viewMatrix);

        var cameraMatrix = m4.identity();
        m4.translate(cameraMatrix, v3.create(-this.xScroll | 0, -this.yScroll | 0, 0), cameraMatrix);

        var baseTransformMatrix = m4.identity();
        m4.translate(baseTransformMatrix, v3.create(-this.baseOffset, 0, 0), baseTransformMatrix);

        this.base.renderBG(this.sprites, alpha, time, this.xScroll+this.baseOffset, this.yScroll);
        this.sprites.renderAndReset(m4.multiply(baseTransformMatrix, m4.multiply(cameraMatrix, this.viewMatrix)));

        this.base.render(this.sprites, alpha, time);
        this.sprites.renderAndReset(m4.multiply(baseTransformMatrix, m4.multiply(cameraMatrix, this.viewMatrix)));

        this.level.renderBG(this.sprites, alpha, time, this.xScroll, this.yScroll);
        this.sprites.renderAndReset(m4.multiply(cameraMatrix, this.viewMatrix));

        this.level.render(this.sprites, alpha, time);
        this.sprites.renderAndReset(m4.multiply(cameraMatrix, this.viewMatrix));

        this.renderGUI();
    }

    renderGUI() {
        var xOffs = this.cursor * 8;
        var yOffs = 16;
        if (this.input.m0Pressed) yOffs += 8;

        this.sprites.add(new Sprite(this.xm, this.ym, 8, 8, xOffs, yOffs, this.cursorABCDs[this.cursor]));
        this.sprites.renderAndReset(this.viewMatrix);
    }

}
