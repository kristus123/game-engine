export async function LoadAsepriteAssets(path) {

	// const fullImage = await LoadImage(`${path}.png`)
	// const fullJson = await LoadJson(`${path}.json`)

	const layersImage = await LoadImage(`${path}Layers.png`)
	const layersJson = await LoadJson(`${path}Layers.json`)

	// const tilemapsJson = await LoadJsonIfPresent(`${path}SpriteTilemapInfo.json`)

	const spriteName = path.split("/").pop()
	Sprite[spriteName] = (position) => new SpriteController(position, layersImage, layersJson)

	// if (tilemapsJson) {
	// 	SpriteTilemapInfo[spriteName] = (d, position, scale=1) => new SpriteTilemapInfoController(d, x, position, fullImage)
	// }
	// else {
	// 	SpriteTilemapInfo[spriteName] = () => {
	// 		throw new Error("This aseprite file does not have tilemap info")
	// 	}
	// }
}
