class Color {
    static get(d) {
		if (d < 0) return -1;
		var r = Math.floor(d / 100) % 10;
		var g = Math.floor(d / 10) % 10;
		var b = d % 10;
		return (r * 36 + g * 6 + b);
    }
    static getABCD(a, b, c, d) {
        return [Color.get(a), Color.get(b), Color.get(c), Color.get(d)];
    }



}