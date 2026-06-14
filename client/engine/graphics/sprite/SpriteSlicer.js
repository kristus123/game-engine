export class SpriteSlicer {
	static slice(sprite, sliceX, sliceY) {
		const sprites = []

		// Same value for both x and y axis because... uniform slices so they look good
		let spriteSize = 0

		// Little hacky? I think it is good because we want to slice uniformly
		// Also we won't need a better implementation until we want to slice animated sprites
		for (const picture of sprite.getAllPicture()) {
			spriteSize = picture.canvas.width
		}

		for (let x = 0; x < sliceX; x++) {
    		for (let y = 0; y < sliceY; y++) {
        		const spriteSlice = sprite.copy()

        		const sx = (spriteSize / sliceX) * x
        		const sy = (spriteSize / sliceY) * y
        		const sw = spriteSize / sliceX
        		const sh = spriteSize / sliceY

        		for (const picture of spriteSlice.getAllPicture()) {
            		picture.crop(sx, sy, sw, sh)
        		}

        		spriteSlice.position = WorldPosition(spriteSlice.position.width * x, spriteSlice.position.height * y, spriteSlice.position.width, spriteSlice.position.height)

        		sprites.push(spriteSlice)
    		}
		}

		return sprites
	}

	static shuffle(slicedSprites) {
		console.log("SLICED_SPRITES BEFORE SHUFFLE: ", slicedSprites)

		let nextSliceIndex = 0

		for (let i = 0; i < slicedSprites.length; i++) {
    		const destSliceIndex = Math.round(Math.random() * (slicedSprites.length - 1))

    		console.log("FROM: ", nextSliceIndex)
    		console.log("TO: ", destSliceIndex)

    		slicedSprites[nextSliceIndex].position = slicedSprites[destSliceIndex].position
    		nextSliceIndex = destSliceIndex
		}

		console.log("SLICED_SPRITES AFTER SHUFFLE: ", slicedSprites)
	}
}