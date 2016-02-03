class Texture {
    constructor(url) {
        this.loaded = false;

        this.texture = twgl.createTexture(gl, {
            min: gl.NEAREST,
            mag: gl.NEAREST,
            src: url
        }, (n, tex, img) => {
            this.width = img.width;
            this.height = img.height;
            this.loaded = true;
        });
    }

    static getPalette() {

        var colors = twgl.primitives.createAugmentedTypedArray(4, 255, Uint8Array)
        for (var r = 0; r < 6; r++) {
            for (var g = 0; g < 6; g++) {
                for (var b = 0; b < 6; b++) {
                    var rr = (r * 255 / 5) | 0;
                    var gg = (g * 255 / 5) | 0;
                    var bb = (b * 255 / 5) | 0;
                    var mid = (rr * 30 + gg * 59 + bb * 11) / 100;

                    var r1 = (((rr + mid *1) / 2) * 230 / 255 + 10) | 0;
                    var g1 = (((gg + mid *1) / 2) * 230 / 255 + 10) | 0;
                    var b1 = (((bb + mid *1) / 2) * 230 / 255 + 10) | 0;
                    colors.push([r1, g1, b1, 255]);
                }
            }
        }

        return twgl.createTexture(gl, {
            mag: gl.NEAREST,
            min: gl.NEAREST,
            format: gl.GL_RGBA,
            src: colors,
            width: 1
          });
    }
}