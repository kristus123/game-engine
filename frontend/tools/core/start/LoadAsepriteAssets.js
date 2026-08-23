export async function LoadAsepriteAssets(path) {

	// const fullImage = await LoadImage(`${path}.png`)
	const fullJson = await LoadJson(`${path}.json`)

	const layersImage = await LoadImage(`${path}Layers.png`)
	const layersJson = await LoadJson(`${path}Layers.json`)
	const groupsJson = await LoadJson(`${path}Groups.json`)


	const spriteName = path.split("/").pop()

	Assert.notPresent(Sprite[spriteName])

	Sprite[spriteName] = (position) => new Sprite(
		position, layersImage, layersJson, fullJson, groupsJson, spriteName)

	const tilemapsJson = await LoadJsonIfPresent(`${path}Tilemaps.json`)

	if (tilemapsJson) {
		TileInfo[spriteName] = (position) => new TileInfoController(position, tilemapsJson)
	}
	else {
		TileInfo[spriteName] = () => {
			throw new Error("This aseprite file does not have tilemap info")
		}
	}
}
