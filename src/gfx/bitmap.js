var bitmaps = [];
class Bitmap {
    constructor(url) {
        bitmaps.push(this);
        var img = new Image();
        img.onload = (() => {
            this.width = img.width;
            this.height = img.height;
            var canvas = document.createElement("canvas");
            canvas.setAttribute("width", this.width+"px");
            canvas.setAttribute("height", this.height+"px");
            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            var data = context.getImageData(0, 0, this.width, this.height).data;
            this.pixels = new Array(this.width * this.height);
            for(var i = 0; i < data.length; i+= 4) {
                var r = data[i + 0];
                var g = data[i + 1];
                var b = data[i + 2];
                var a = data[i + 3];
                this.pixels[i / 4 | 0] = /*(a << 24) |*/ (r << 16) | (g << 8) | (b);
            }
            this.loaded = true;
            console.log("url: " + url + " loaded. w: " + this.width + " h: " + this.height);
        });
        img.src = url;
    }

    static loaded() {
        var result = true;
        for (var i = 0; i < bitmaps.length; i++) {
            if (!bitmaps[i].loaded) {
                result = false;
                console.log("A few of our bitmaps not loaded yet.");
                break;
            }
        }
        return result;
    }
}

var levelsData = [];
for(var i = 0; i < 3; i++) {
    levelsData.push(new Bitmap("resources/levels/" + i + ".png"));
}