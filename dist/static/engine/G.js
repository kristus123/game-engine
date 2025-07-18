import { SplashParticles } from '/static/engine/graphics/particles/SplashParticles.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Barn } from '/static/game/world/Barn.js'; 

export const G = {
	ranches: new LocalObjects([]),
	poop: new LocalObjects([]),
	trees: new LocalObjects([]),
	monsters: new LocalObjects([]),
	workers: new LocalObjects([]),
	fire: new LocalObjects([]),
	splash: new SplashParticles(),
	chickenFood: new LocalObjects([]),
	money: 0,
	barn: new Barn(new Position(-200, 0)),
	pictures: {},
	Sprite: {},
}
