import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { GrassGrid } from '/static/engine/graphics/grid/GrassGrid.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { HouseGrid } from '/static/engine/graphics/grid/HouseGrid.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class World {
	constructor() {


		Camera.follow(new Position(800, 800))

		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			new GrassGrid(),
			new HouseGrid(),

			new OnTrue(() => Keyboard.q, () => {
				this.p.changeText('dirt')
				G.tile = 'dirt'
				Sound.click()
			}),
			new OnTrue(() => Keyboard.w, () => {
				this.p.changeText('water')
				G.tile = 'water'
				Sound.click()
			}),
		])

		Html.upper([
				Html.div('big', [
					Html.p('Q to select dirt'),
				]),
				Html.div('big', [
					Html.p('W to select water'),
				]),
				Html.div('big', [
					Html.p('right click to erase'),
				]),
		])

		Html.lower([
				Html.div('big', [
					this.p = Html.p('hei'),
				]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
