class Map {
    constructor(w, h, name) {
        this.w = w;
        this.h = h;
        this.name = name;
        this.entities = [];
        this.entitiesInTiles = new Array(w * h);
        this.tiles = new Array(w * h);
        for(var i = 0; i < w * h; i++) {
            this.tiles[i] = grassTile.id;
            if (Math.random() < 0.3) {
                this.tiles[i] = groundTile.id;
            }
            this.entitiesInTiles[i] = [];
        }
        this.monsterDensity = 7;
        this.raiders = [];
        this.spRegen = 0;
        this.hpRegen = 0;

        this.dirtColor = 550;
        this.grassColor = 141;
    }

    _removeEntity(x, y, e) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
        var idToBeRemoved = e.id;
        var list = this.entitiesInTiles[x + y * this.w];
        for (var i = 0; i < list.length; i++) {
            if (idToBeRemoved == list[i].id) {
                list.splice(i, 1);
            }
        }
    }

    _insertEntity(x, y, e) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
        this.entitiesInTiles[x + y * this.w].push(e);
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) return grassTile;
        return tileInstances[this.tiles[x + y * this.w]];
    }

    setTile(x, y, tile) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
        this.tiles[x + y * this.w] = tile.id;
    }

    addEntity(e){
        if (e instanceof Raider) {
            this.raiders.push(e);
        }
        e.removed = false;
        if (e.health <= 0) e.health = 1;
        this.entities.push(e);
        e.init(this);

        this._insertEntity((e.x | 0) >> 4, (e.y | 0) >> 4, e);
    }

    removeEntity(e) {
        if (e instanceof Raider) {
            for(var i = 0; i < this.raiders.length; i++) {
                if (this.raiders[i].id == e.id) {
                    this.raiders.splice(i, 1);
                    break;
                }
            }
        }
        this._removeEntity((e.x | 0) >> 4, (e.y | 0) >> 4, e);
        for(var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].id == e.id) {
                this.entities.splice(i, 1);
                break;
            }
        }
    }

    getEntities(x0, y0, x1, y1) {
        var result = [];
        var xt0 = ((x0 | 0) >> 4) - 1;
        var yt0 = ((y0 | 0) >> 4) - 1;
        var xt1 = ((x1 | 0) >> 4) + 1;
        var yt1 = ((y1 | 0) >> 4) + 1;

        for(var y = yt0; y < yt1; y++) {
            for(var x = xt0; x < xt1; x++) {
                if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
                var list = this.entitiesInTiles[x + y * this.w];
                for(var i = 0; i < list.length; i++) {
                    var e = list[i];
                    if (e.intersects(x0, y0, x1, y1)) {
                        result.push(e);
                    }
                }
            }
        }

        return result;
    }

    getNearEntity(entityFrom, x0, y0, x1, y1, filter) {
        var xt0 = ((x0 | 0) >> 4) - 1;
        var yt0 = ((y0 | 0) >> 4) - 1;
        var xt1 = ((x1 | 0) >> 4) + 1;
        var yt1 = ((y1 | 0) >> 4) + 1;

        var result = null;
        var min = -1;
        for(var y = yt0; y < yt1; y++) {
            for(var x = xt0; x < xt1; x++) {
                if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
                var list = this.entitiesInTiles[x + y * this.w];
                for(var i = 0; i < list.length; i++) {
                    var e = list[i];
                    if (!e.intersects(x0, y0, x1, y1)) continue
                    if (filter != null && !filter(e)) continue;
                    var dist = entityFrom.distTo(e);
                    if (dist < min || min == -1) {
                        min = dist;
                        result = e;
                    }
                }
            }
        }

        return result;
    }

    tick() {
        for(var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];

            var xto = (e.x | 0) >> 4;
            var yto = (e.y | 0) >> 4;

            if (!e.removed) e.tick();
            if (e.removed) {
                if (e instanceof Mob) {
                    this.monsterHasDied(e);
                }
                this.entities.splice(i--, 1);
                this._removeEntity(xto, yto, e);
            } else  {
                var xt = (e.x | 0) >> 4;
                var yt = (e.y | 0) >> 4;

                if (xto != xt || yto != yt) {
                    this._removeEntity(xto, yto, e);
                    this._insertEntity(xt, yt, e);
                }
            }
        }
    }

    monsterHasDied(e) {

    }

    renderBG(sprites, alpha, time, xScroll, yScroll) {
        var x0 = (xScroll | 0) >> 4;
        var y0 = (yScroll | 0) >> 4;
        var x1 = x0 + ((WIDTH / SCALE | 0) >> 4) + 2;
        var y1 = y0 + ((HEIGHT / SCALE | 0) >> 4) + 2;
        if (x0 < 0) x0 = 0;
        if (y0 < 0) y0 = 0;
        if (x1 > this.w) x1 = this.w;
        if (y1 > this.h) y1 = this.h;
        for (var y = y0; y < y1; y++) {
            for (var x = x0; x < x1; x++) {
                tileInstances[this.tiles[x + y * this.w]].render(this, x, y, sprites, alpha, time);
            }
        }
    }

    render(sprites, alpha, time) {
        for(var i = 0; i < this.entities.length; i++) {
            this.entities[i].render(sprites, alpha, time);
        }
    }
}