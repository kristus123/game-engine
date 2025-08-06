import { Init } from '/static/engine/Init.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { NormalMapPicture } from '/static/engine/code_tools/misc/NormalMapPicture.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { PictureInPicture } from '/static/engine/code_tools/misc/PictureInPicture.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Anchor } from '/static/engine/core/camera/Anchor.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { PersistedObjectsEditor } from '/static/engine/editor/PersistedObjectsEditor.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Overlay } from '/static/engine/graphics/ui/Overlay.js'; 
import { SimplePathFinder } from '/static/engine/mechanics/SimplePathFinder.js'; 
import { InvisibleWall } from '/static/engine/mechanics/invisible_walls/InvisibleWall.js'; 
import { InvisibleWalls } from '/static/engine/mechanics/invisible_walls/InvisibleWalls.js'; 
import { InvisibleWallsEditor } from '/static/engine/mechanics/invisible_walls/InvisibleWallsEditor.js'; 
import { PathFinder } from '/static/engine/mechanics/path_finder/PathFinder.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Positions } from '/static/engine/position/Positions.js'; 
import { D } from '/static/game/world/D.js'; 
import { Player } from '/static/game/world/player/Player.js'; 

export class WorldEditor {

	constructor() {


		Camera.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))
		Controller.control(Camera.objectToFollow)

		Overlay.leftButton('left', () => {})

		this.localObjects = new LocalObjects([
			Init(this, {
				player: new PlayerEditor().player,
				invisibleWalls: new InvisibleWallsEditor(),
			}),

			// new PersistedPictureEditor('/static/assets/houses.png', '/persisted-objects/houses.json', 1700, 600),
			// new PersistedPictureEditor('/static/assets/stones/stone1.png', '/persisted-objects/stone1.json'),
			// new PersistedPictureEditor('/static/assets/stones/stone2.png', '/persisted-objects/stone2.json'),
			// new PersistedPictureEditor('/static/assets/stones/stone3.png', '/persisted-objects/stone3.json'),
			// new PersistedPictureEditor('/static/assets/bush.png', '/persisted-objects/bush.json', 200, 200),
			// new PersistedPictureEditor('/static/assets/tree.png', '/persisted-objects/tree.json', 400, 400),

			// new PersistedObjectsEditor(
			// 	'/persisted-objects/chickens.json',
			// 	position => new Chicken(position),
			// 	json => {
			// 		const c = new Chicken(new Position(json.position.x, json.position.y))
			// 		c.objectId = json.objectId
			// 		return c
			// 	},
			// ),

			// Init(this, {
			// 	blobMonster: new BlobMonster(this.player, this.invisibleWalls.persisted.persistedObjects.objects),
			// })

			// new SimplePathFinder(this.player, this.invisibleWalls.persisted.persistedObjects.objects),
			// new PictureInPicture()
			// new NormalMapPicture(new Position(0, 0, 100, 100), '/static/assets/nn.png')
		])

		// Camera.anchoredPositions.add(new Anchor(Camera. this.blobMonster, 1000, 0.2))

		this.pixels = new LocalObjects()
	}

	exitEditMode() { // easy pz hack
		this.localObjects.remove(this.player)
		Overlay.clearAll()
		return this
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {

		this.localObjects.draw(draw, guiDraw)

		this.pixels.draw(draw, guiDraw)
	}
}
