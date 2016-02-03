class Input {
    constructor (canvas) {
        canvas.addEventListener('mousemove', (event) => {
            this._x = event.x;
            this._y = event.y;
        }, true);

        canvas.addEventListener('mousedown', (event) => {
            if (event.button == 0) this._m0Pressed = true;
        }, true);

        canvas.addEventListener('mouseup', (event) => {
            if (event.button == 0) this._m0Pressed = false;
        }, true);
    }

    tick() {
        this.x = this._x;
        this.y = this._y;
        this.m0Clicked = !this.m0Pressed && this._m0Pressed;
        this.m0Pressed = this._m0Pressed;
        if (this.m0Pressed) {
            if (this.dragging) {
                this.xDragA = this.xDrag - this.x;
                this.yDragA = this.yDrag - this.y;
            } else {
                this.dragging = true;
            }
            this.xDrag = this.x;
            this.yDrag = this.y;
        } else {
            this.dragging = false;
        }
    }
}
