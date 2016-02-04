class Raider extends Entity {

    constructor(game) {
        super();
        this.game = game;
        this.wasDie = false;
    }

    die() {
        this.wasDie = true;
    }
}