export async function InitSprites() {
	return ASEPRITE_FILES.map(async path => {
		const fileName = path.split('/').pop()

		fullImage = await LoadImage(`${path}.png`)
		fullJson = await LoadJson(`${path}.json`)
		layersImage = await LoadImage(`${path}Layers.png`)
		layersJson = await LoadJson(`${path}Layers.json`)
		tilemapsJson = await LoadJsonIfPresent(`${path}Tilemaps.json`)

		Sprite[fileName] = (d, position, scale=1) => new SpriteController(
			d,
			position,
			fullImage,
			fullJson,
			layersImage,
			layersJson,
			tilemapsJson,
			scale)
	})
}
