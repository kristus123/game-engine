import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Noise } from '/static/engine/graphics/Noise.js'; 

export class WaterColor {
    constructor(palette, layers = 30) {

				AssertNotNull(palette, "argument palette in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(layers, "argument layers in " + this.constructor.name + ".js should not be null")
			
		this.palette = palette; 
		this.layers = layers; 

        this.palette = palette
        this.ctx = palette.ctx
        this.width = palette.canvas.width
        this.height = palette.canvas.height
        this.layers = layers

        this.noiseCanvas = document.createElement('canvas')
        this.noiseCanvas.width = this.width
        this.noiseCanvas.height = this.height
        this.noiseCtx = this.noiseCanvas.getContext('2d')
        this.generateNoise()
    }

    generateNoise() {
        const imgData = this.noiseCtx.createImageData(this.width, this.height)
        for (let i = 0; i < imgData.data.length; i += 4) {
            const v = Math.random() * 50
            imgData.data[i] = v
            imgData.data[i + 1] = v
            imgData.data[i + 2] = v
            imgData.data[i + 3] = 20
        }
        this.noiseCtx.putImageData(imgData, 0, 0)
    }

    apply() {
        this.ctx.save()
        for (let i = 0; i < this.layers; i++) {
            this.ctx.globalAlpha = 0.2
            this.ctx.filter = `blur(${1 + i}px)`
            const imgData = this.ctx.getImageData(0, 0, this.width, this.height)
            this.ctx.putImageData(imgData, 0, 0)
        }
        this.ctx.globalAlpha = 0.3
        this.ctx.drawImage(this.noiseCanvas, 0, 0)
        this.ctx.globalAlpha = 1
        this.ctx.restore()
    }
}

