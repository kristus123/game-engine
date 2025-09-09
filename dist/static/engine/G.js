import { InvisibleWalls } from '/static/engine/mechanics/invisible_walls/InvisibleWalls.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export const G = {
	ranches: new LocalObjects([]),
	poop: new LocalObjects([]),
	trees: new LocalObjects([]),
	monsters: new LocalObjects([]),
	workers: new LocalObjects([]),
	fire: new LocalObjects([]),
	chickenFood: new LocalObjects([]),
	allies: new LocalObjects([]),
	turrets: new LocalObjects([]),
	invisibleWalls: new InvisibleWalls([
	]),
	money: 20,
	wave: 1,
	pause: false,
	pictures: {},
	Sprite: {},
	TileSheet: {},
	Audio: {},
	image: {},
	SpriteLayers: {},
	tilemaps: {},
}
