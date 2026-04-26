export async function LoadAsepriteAssets(path) {

	// const fullImage = await LoadImage(`${path}.png`)
	// const fullJson = await LoadJson(`${path}.json`)

	const layersImage = await LoadImage(`${path}Layers.png`)
	const layersJson = await LoadJson(`${path}Layers.json`)

	const spriteName = path.split("/").pop()
	Sprite[spriteName] = (position) => new SpriteController(position, layersImage, layersJson)

	const tilemapsJson = await LoadJsonIfPresent(`${path}Tilemaps.json`)
	if (tilemapsJson) {
		console.log(spriteName)
		TileInfo[spriteName] = (position) => new TileInfoController(position, tilemapsJson)
	}
	else {
		TileInfo[spriteName] = () => {
			throw new Error("This aseprite file does not have tilemap info")
		}
	}
}
