export class WebGl {
	constructor() {
		this.canvas = document.getElementById('game')

		this.gl = this.canvas.getContext('webgl')

		if (!this.gl) {
			console.error('Unable to initialize WebGL. Your browser may not support it.')
			return
		}

		this.initShaders()
		this.initBuffers()
	}

	initShaders() {
		const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `

		const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
            }
        `

		const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER)
		const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER)

		this.shaderProgram = this.gl.createProgram()
		this.gl.attachShader(this.shaderProgram, vertexShader)
		this.gl.attachShader(this.shaderProgram, fragmentShader)
		this.gl.linkProgram(this.shaderProgram)

		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			console.error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(this.shaderProgram)}`)
			return
		}

		this.gl.useProgram(this.shaderProgram)
	}

	compileShader(source, type) {
		const shader = this.gl.createShader(type)
		this.gl.shaderSource(shader, source)
		this.gl.compileShader(shader)

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`)
			this.gl.deleteShader(shader)
			return null
		}

		return shader
	}

	initBuffers() {
		this.positionBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
		const vertices = new Float32Array([
			-0.5,
			-0.5,
			0.5,
			-0.5,
			-0.5,
			0.5,
			0.5,
			0.5,
		])
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

		const positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position')
		this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0)
		this.gl.enableVertexAttribArray(positionAttributeLocation)
	}

	draw() {
		if (!this.gl) {
			console.log('Unable to initialize WebGL. Your browser may not support it.')
		}
		// this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
		// this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		// this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
	}
}

