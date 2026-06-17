export class SpriteSlicer {
	static slice(sprite, sliceCountX, sliceCountY) {
		const sprites = []

		// Same value for both x and y axis because... uniform slices so they look good
		let spriteWidth = 0
		let spriteHeight = 0

		// Little hacky? I think it is good because we want to slice uniformly
		// Also we won't need a better implementation until we want to slice animated sprites
		for (const picture of sprite.getAllPicture()) {
			spriteWidth = picture.canvas.width
			spriteHeight = picture.canvas.height

			break // We only need the first picture
		}

		for (let x = 0; x < sliceCountX; x++) {
			for (let y = 0; y < sliceCountY; y++) {
    			const spriteSlice = sprite.copy()

    			const sx = Math.round((spriteWidth / sliceCountX)) * x
    			const sy = Math.round((spriteHeight / sliceCountY)) * y
    			const sw = Math.round(spriteWidth / sliceCountX)
    			const sh = Math.round(spriteHeight / sliceCountY)

    			for (const picture of spriteSlice.getAllPicture()) {
        			picture.crop(sx, sy, sw, sh)

					const spriteSliceWidth = picture.canvas.width * Scale.value
					const spriteSliceHeight = picture.canvas.height * Scale.value

					spriteSlice.position = WorldPosition(
						spriteSliceWidth * x,
						spriteSliceHeight * y,
						spriteSliceWidth,
						spriteSliceHeight
					)
    			}


    			sprites.push(spriteSlice)
			}
		}

		return sprites
	}

	static shuffle(slicedSprites) {
		let nextSliceIndex = 0

		for (let i = 0; i < slicedSprites.length; i++) {
			const destSliceIndex = Math.round(Math.random() * (slicedSprites.length - 1))

			slicedSprites[nextSliceIndex].position = slicedSprites[destSliceIndex].position
			nextSliceIndex = destSliceIndex
		}
	}
}