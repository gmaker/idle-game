class Sprites {
    constructor() {
        this.MAX_SPRITES = 65536 / 4 | 0;
        var numVertices = 4 * this.MAX_SPRITES;
        var numIndices = 6 * this.MAX_SPRITES;

        this.arrays = {
            position: twgl.primitives.createAugmentedTypedArray(2, numVertices, Float32Array),
            texcoord: twgl.primitives.createAugmentedTypedArray(2, numVertices, Float32Array),
            color: twgl.primitives.createAugmentedTypedArray(4, numVertices, Float32Array),
            indices: twgl.primitives.createAugmentedTypedArray(3, numIndices, Uint16Array)
        };

        for(var i = 0; i < this.MAX_SPRITES; i++) {
            var offs = i * 4;
            this.arrays.indices.push(
                [
                    offs + 0, offs + 1, offs + 2,
                    offs + 0, offs + 2, offs + 3,
                ]
            );
        }

        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, this.arrays);

        this.sprites = new Array();
        this.programInfo = null;
        this.uniforms = {
            u_viewMatrix: null,
            u_texture: null,
            u_palette: null
        };
        this.texture = null;
        this.palette = null;
    }

    setTexture(texture, palette) {
        this.texture = texture;
        this.uniforms.u_texture = texture.texture;
        this.palette = palette;
        this.uniforms.u_palette = palette;
    }

    setProgram(programInfo) {
        this.programInfo = programInfo;
        gl.useProgram(this.programInfo.program);
    }

    add(sprite) {
        if (this.sprites.length >= this.MAX_SPRITES) return;
        this.sprites.push(sprite);
    }

    reset() {
       this.sprites = [];
       this.arrays.position.reset();
       this.arrays.texcoord.reset();
       this.arrays.color.reset();
    }

    renderAndReset(viewMatrix) {
        if (!this.texture.loaded) return;
        if (this.sprites.length == 0) return;

        this.uniforms.u_viewMatrix = viewMatrix;
        for(var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].setData(this.arrays);
        }

        twgl.setAttribInfoBufferFromArray(gl, this.bufferInfo.attribs.position, this.arrays.position);
        twgl.setAttribInfoBufferFromArray(gl, this.bufferInfo.attribs.texcoord, this.arrays.texcoord);
        twgl.setAttribInfoBufferFromArray(gl, this.bufferInfo.attribs.color, this.arrays.color);

        twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, this.uniforms);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, this.bufferInfo, this.sprites.length * 6);

        this.reset();
    }

}

class Sprite {
    constructor(x, y, w, h, u, v, abcd, flip) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.u = u;
        this.v = v;
        this.abcd = abcd;
        this.flipX = (flip & 1) != 0;
        this.flipY = (flip & 2) != 0;
    }

    setData(arrays) {

        arrays.position.push(
            [
                this.x, this.y,
                this.x + this.w, this.y,
                this.x + this.w, this.y + this.h,
                this.x, this.y + this.h,
            ]
        );

        var v00 = [this.u, this.v];
        var v10 = [this.u + this.w, this.v];
        var v11 = [this.u + this.w, this.v + this.h];
        var v01 = [this.u, this.v + this.h];

        if (this.flipX) {
            var temp = v00;
            v00 = v10;
            v10 = temp;

            temp = v01;
            v01 = v11;
            v11 = temp;
        }

        if (this.flipY) {
            var temp = v00
            v00 = v01;
            v01 = temp;

            temp = v10;
            v10 = v11;
            v11 = temp;
        }

        arrays.texcoord.push.apply(arrays.texcoord, v00);
        arrays.texcoord.push.apply(arrays.texcoord, v10);
        arrays.texcoord.push.apply(arrays.texcoord, v11);
        arrays.texcoord.push.apply(arrays.texcoord, v01);

        arrays.color.push(
            [
                this.abcd[0], this.abcd[1], this.abcd[2], this.abcd[3],
                this.abcd[0], this.abcd[1], this.abcd[2], this.abcd[3],
                this.abcd[0], this.abcd[1], this.abcd[2], this.abcd[3],
                this.abcd[0], this.abcd[1], this.abcd[2], this.abcd[3],
            ]
        );
    }
}