import { Loop } from '/static/Loop.js';
import { LevelOne } from '/static/LevelOne.js';

const levelOne = new LevelOne()

Loop.everyFrame(deltaTime => {
	levelOne.runFrame(deltaTime)
})
