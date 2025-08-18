import { SplashParticles } from '/static/engine/graphics/particles/SplashParticles.js'; 
import { InvisibleWall } from '/static/engine/mechanics/invisible_walls/InvisibleWall.js'; 
import { WalkableAreas } from '/static/engine/mechanics/invisible_walls/WalkableAreas.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export const G = {
	ranches: new LocalObjects([]),
	poop: new LocalObjects([]),
	trees: new LocalObjects([]),
	monsters: new LocalObjects([]),
	workers: new LocalObjects([]),
	fire: new LocalObjects([]),
	splash: new SplashParticles(),
	chickenFood: new LocalObjects([]),
	allies: new LocalObjects([]),
	invisibleWalls: new LocalObjects([
		new InvisibleWall(new Position(1200, 2200, 300, 800)),
	]),
	walkableAreas: new WalkableAreas(),
	money: 20,
	pictures: {},
	Sprite: {},
	Audio: {},
	image: {},
	SpriteLayers: {},
}
