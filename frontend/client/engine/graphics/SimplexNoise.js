// noiseScale
// lower = more smooth : 0.1
// higher = crazy : 1.5

export class SimplexNoise {
	constructor(noiseScale = 1) {
		this.noiseScale = noiseScale
		// Permutation table
		this.perm = []
		for (let i = 0; i < 512; i++) {
			this.perm[i] = Math.floor(Math.random() * 256)
		}
		this.perm = this.perm.concat(this.perm)
	}

	// Gradient vectors
	grad3 = [[1, 1, 0],
		[-1, 1, 0],
		[1, -1, 0],
		[-1, -1, 0],
		[1, 0, 1],
		[-1, 0, 1],
		[1, 0, -1],
		[-1, 0, -1],
		[0, 1, 1],
		[0, -1, 1],
		[0, 1, -1],
		[0, -1, -1]]

	// Permutation table
	perm = []

	// Simplex noise function
	noise(position, time = 1) {
		const xin = position.x * this.noiseScale
		const yin = position.y * this.noiseScale
		const zin = time * this.noiseScale // Introduce a time component
		let n0, n1, n2, n3 // Noise contributions from the four corners

		// Skew the input space to determine which simplex cell we're in
		const F3 = 1.0 / 3.0
		const s = (xin + yin + zin) * F3 // Very nice and simple skew factor for 3D
		const i = Math.floor(xin + s)
		const j = Math.floor(yin + s)
		const k = Math.floor(zin + s)

		const G3 = 1.0 / 6.0
		const t = (i + j + k) * G3
		const X0 = i - t
		const Y0 = j - t
		const Z0 = k - t

		const x0 = xin - X0
		const y0 = yin - Y0
		const z0 = zin - Z0

		let i1, j1, k1
		let i2, j2, k2

		if (x0 >= y0) {
			if (y0 >= z0) {
				i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0
			}
			else if (x0 >= z0) {
				i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1
			}
			else {
				i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1
			}
		}
		else {
			if (y0 < z0) {
				i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1
			}
			else if (x0 < z0) {
				i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1
			}
			else {
				i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0
			}
		}

		const x1 = x0 - i1 + G3
		const y1 = y0 - j1 + G3
		const z1 = z0 - k1 + G3
		const x2 = x0 - i2 + 2.0 * G3
		const y2 = y0 - j2 + 2.0 * G3
		const z2 = z0 - k2 + 2.0 * G3
		const x3 = x0 - 1.0 + 3.0 * G3
		const y3 = y0 - 1.0 + 3.0 * G3
		const z3 = z0 - 1.0 + 3.0 * G3

		const ii = i & 255
		const jj = j & 255
		const kk = k & 255

		const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12
		const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12
		const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12
		const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12

		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
		if (t0 < 0) {
			n0 = 0.0
		}
		else {
			t0 *= t0
			n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0)
		}

		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
		if (t1 < 0) {
			n1 = 0.0
		}
		else {
			t1 *= t1
			n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1)
		}

		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
		if (t2 < 0) {
			n2 = 0.0
		}
		else {
			t2 *= t2
			n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2)
		}

		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
		if (t3 < 0) {
			n3 = 0.0
		}
		else {
			t3 *= t3
			n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3)
		}

		return 32.0 * (n0 + n1 + n2 + n3)
	}

	dot(g, x, y, z) {
		return g[0] * x + g[1] * y + g[2] * z
	}
}

