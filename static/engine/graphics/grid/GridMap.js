export class GridMap {
	constructor() {
		this.grid = new Grid()
		
		// Tile Data Will Be Imported from "TileList.js"
		this.tile_data = {
			"pallette": null,
			"sound_method": null, // Like: "playDirt" -> Sound.playDirt()
			"sprite": null,
			"ghost_method": null // Like: "transparentGreenRectangle" -> D1.transparentGreenRectangle(pos)
		}
	}
	set_current_tile(data) {
		this.tile_data = data;
	}
	get_current_tile() {
		return this.tile_data;
	}
	update() {
		D1.palette(this.tile_data["pallette"])

		const gridPosition = this.grid.toGridPosition(Mouse.position)
		const snappedPosition = this.grid.snappedPosition(Mouse.position)
		D1[this.tile_data["ghost_method"]].call(D1, snappedPosition)

		for (const tile of this.grid.scaledTiles()) {
			if (Mouse.hovering(tile)) {
				D1.transparentRedRectangle(tile)
			}
		}

		if (Mouse.down) {
			if (this.grid.has(gridPosition)) {
				D1.text(snappedPosition, 'full')
			}
			else {
				if (G.tile) {
					this.grid.add(Mouse.position)
					Sound[this.tile_data["sound_method"]].call(Sound)
					this.tile_data["pallette"].draw.picture(snappedPosition, tile_data["sprite"])
				}
			}
		}
		else if (Mouse.rightDown) {
			this.grid.remove(Mouse.position)
			this.tile_data["pallette"].draw.erase(snappedPosition)
		}
	}
}
