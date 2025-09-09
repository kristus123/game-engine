import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Palette } from '/static/engine/palette/Palette.js'; 

export class SingleTile {
	constructor(image, asepriteTilesJson, tile, position) {

				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(asepriteTilesJson, "argument asepriteTilesJson in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(tile, "argument tile in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.image = image; 
		this.asepriteTilesJson = asepriteTilesJson; 
		this.tile = tile; 
		this.position = position; 


		this.palette = Palette.fixedOffscreen(
			this.position.width,
			this.position.height
		)

		this.palette.ctx.drawImage(
			image,
			tile.x * asepriteTilesJson.width,
			tile.y * asepriteTilesJson.height,
			asepriteTilesJson.width,
			asepriteTilesJson.height,
			0,
			0,
			this.position.width,
			this.position.height
		)
	}

	draw(draw) {
		draw.ctx.drawImage(
			this.palette.canvas,
			this.position.x,
			this.position.y
		)
	}
}

