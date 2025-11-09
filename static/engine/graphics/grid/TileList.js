export const TileList = {
	GRASS_TILE: {
		"pallette": Palette.fixedOffscreen(4000, 4000),
		"sound_method": "placeDirt",
		"sprite": G.image.grassTile,
		"ghost_method": "transparentGreenRectangle",
	},
	WATER_TILE: {
		"pallette": Palette.fixedOffscreen(4000, 4000),
		"sound_method": "placeDirt",
		"sprite": G.image.waterTile,
		"ghost_method": "transparentBlueRectangle",
	},
}
