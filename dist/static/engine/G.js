import { SplashParticles } from '/static/engine/graphics/particles/SplashParticles.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { EventBus } from '/static/game/utils/EventBus.js'; 

export const G = {
	ranches: new LocalObjects([]),
	events: new EventBus(),
	poop: new LocalObjects([]),
	trees: new LocalObjects([]),
	monsters: new LocalObjects([]),
	workers: new LocalObjects([]),
	fire: new LocalObjects([]),
	splash: new SplashParticles(),
	chickenFood: new LocalObjects([]),
	money: 20,
	pictures: {},
	Sprite: {},
	Audio: {},
	image: {},
	SpriteLayers: {},
}
