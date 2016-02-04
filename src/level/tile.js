var tileInstances = [];
class Tile {
    constructor(id) {
        tileInstances[id] = this;
        this.id = id;

        this.random = new Random();
    }

    render(level, x, y, sprites, alpha, time){
    }

    mayPass(level, x, y, e) {
        return true;
    }
}

class GrassTile extends Tile {
    constructor(id) {
        super(id);
    }
    render(level, x, y, sprites, alpha, time){
        this.random.setSeed(x + y * 8);
        var grassColor = level.grassColor;
        sprites.add(new Sprite(x * 16 + 0, y * 16 + 0, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, grassColor+111, grassColor, 0), this.random.nextIntEnd(4)));
        sprites.add(new Sprite(x * 16 + 8, y * 16 + 0, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, grassColor+111, grassColor, 0), this.random.nextIntEnd(4)));
        sprites.add(new Sprite(x * 16 + 0, y * 16 + 8, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, grassColor+111, grassColor, 0), this.random.nextIntEnd(4)));
        sprites.add(new Sprite(x * 16 + 8, y * 16 + 8, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, grassColor+111, grassColor, 0), this.random.nextIntEnd(4)));
    }
}

class GroundTile extends Tile {
    constructor(id) {
        super(id);
    }
    render(level, x, y, sprites, alpha, time){
        this.random.setSeed(x + y * 16);
        var dirtColor = level.dirtColor;
        sprites.add(new Sprite(x * 16 + 0, y * 16 + 0, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, dirtColor-110, dirtColor, 0), this.random.nextIntEnd(4)));
        sprites.add(new Sprite(x * 16 + 8, y * 16 + 0, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, dirtColor-110, dirtColor, 0), this.random.nextIntEnd(4)));
        sprites.add(new Sprite(x * 16 + 0, y * 16 + 8, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, dirtColor-110, dirtColor, 0), this.random.nextIntEnd(4)));
        sprites.add(new Sprite(x * 16 + 8, y * 16 + 8, 8, 8, this.random.nextIntEnd(4)*8, 0, Color.getABCD(0, dirtColor-110, dirtColor, 0), this.random.nextIntEnd(4)));
    }
}

class NextLevelTile extends GrassTile {
    constructor(id) {
        super(id);
    }

    render(level, x, y, sprites, alpha, time){
        super.render(level, x, y, sprites, alpha, time);
        var c = ((time / 300 | 0) % 2) * 100 * 5;
        sprites.add(new Sprite(x * 16 + 8, y * 16 + 0, 8, 8, 0, 8, Color.getABCD(-1, c, -1, 112)));
        sprites.add(new Sprite(x * 16 + 8, y * 16 + 8, 8, 8, 0, 8, Color.getABCD(-1, c, -1, 112)));
    }
}


var grassTile = new GrassTile(0);
var groundTile = new GroundTile(1);
var nextLevelTile = new NextLevelTile(2);