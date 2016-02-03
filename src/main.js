class GameComponent {
  constructor(input) {
    this.tickTime = 0;

    this.spendingTime = 0;
    this.framePerSecond = 60.0;
    this.msPerTick = 1000.0 / this.framePerSecond;
    this.fps = 0;
    this.ups = 0;
    this.lastTime = new Date().getTime();
    this.lastFPSTime = new Date().getTime();
    this.game = new Game(input);
  }

  animate(time) {
    var now = new Date().getTime();
    this.spendingTime += (now - this.lastTime);
    this.lastTime = now;
    var ticks = 0;
    while (this.spendingTime >= this.msPerTick) {
      ticks++;
      this.spendingTime -= this.msPerTick;
    }

    if (ticks > 10) ticks = 10;
    for (var i = 0; i < ticks; i++) {
      this.game.tick();
      this.ups++;
    }

    this.game.render(this.spendingTime / this.msPerTick, time);
    this.fps++;

    if (new Date().getTime() - this.lastFPSTime > 1000) {
      this.lastFPSTime += 1000;
      //console.log("fps: " + this.fps + " ups: " + this.ups);
      this.fps = this.ups = 0;
    }
  }
}

var WIDTH = 320;
var HEIGHT = 240;
var SCALE = 3;
var gameComponent = null;
var gl = null;
var m4 = twgl.m4;
var v3 = twgl.v3;
var random = new Random();
var canvas = null;
initRequestAnimationFrame();
initWebGLContext();
initEventListeners();
launchGame();

function launchGame() {
    animate();
}

function animate(time) {
    if (!gameComponent) gameComponent = new GameComponent(new Input(canvas));
    gameComponent.animate(time);
    window.requestAnimationFrame(animate);
}

function initRequestAnimationFrame() {
    var w = window;
    var foundRequestAnimationFrame =
        w.requestAnimationFrame ||
            w.webkitRequestAnimationFrame ||
            w.msRequestAnimationFrame ||
            w.mozRequestAnimationFrame ||
            w.oRequestAnimationFrame ||
            function (cb) {
                setTimeout(cb, 1000 / 60);
            };
    window.requestAnimationFrame = foundRequestAnimationFrame;
    requestAnimationFrame(voidFunction);
}

function initWebGLContext() {
    var div = document.getElementById("game_div");
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", WIDTH+"px");
    canvas.setAttribute("height", HEIGHT+"px");
    div.appendChild(canvas);

    gl = twgl.getWebGLContext(canvas);
    //gl.enable(gl.DEPTH_TEST);
    //gl.depthFunc(gl.LESS);
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    resize();
}

function initEventListeners() {
    window.addEventListener('resize', resize, true);
}

function resize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.setAttribute("width", WIDTH+"px");
    canvas.setAttribute("height", HEIGHT+"px");
    /*var xs = w / WIDTH;
    var ys = h / HEIGHT;

    if (xs < ys) {
        var hh = Math.floor(HEIGHT * xs);
        canvas.setAttribute("style", "width: " + w + "px; height: " + hh + "px; left: 0px; top: " + Math.floor((h - hh) / 5.0) + "px;");
    } else {
        var ww = Math.floor(WIDTH * ys);
        canvas.setAttribute("style", "width: " + ww + "px; height: " + h + "px; left: " + Math.floor((w - ww) / 2.0) + "px; top: 0px;")
    }*/
}

function voidFunction() {

}
