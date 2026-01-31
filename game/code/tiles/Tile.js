export class Tile {
	constructor(index, position, picturePosition, layer, scale) {
	}

	erase() {
		this.layer.picture.erasePixel(this.picturePosition)
	}

	pixelPosition(x, y) {
		return Position(
    		this.position.x + (x*Scale.value*this.scale),
    		this.position.y + (y*Scale.value*this.scale),
    		Scale.value*this.scale,
    		Scale.value*this.scale)
	}
}



















// - class SingleTile {
// -       constructor(image, asepriteTilesJson, tile, position) {
// -
// -               this.palette = Palette.fixedOffscreen(
// -                       this.position.width,
// -                       this.position.height
// -               )
// -
// -               this.palette.ctx.drawImage(
// -                       image,
// -                       tile.x * asepriteTilesJson.width,
// -                       tile.y * asepriteTilesJson.height,
// -                       asepriteTilesJson.width,
// -                       asepriteTilesJson.height,
// -                       0,
// -                       0,
// -                       this.position.width,
// -                       this.position.height
// -               )
// -       }
// -
// -       draw(draw) {
// -               draw.ctx.drawImage(
// -                       this.palette.canvas,
// -                       this.position.x,
// -                       this.position.y
// -               )
// -       }
// -}



