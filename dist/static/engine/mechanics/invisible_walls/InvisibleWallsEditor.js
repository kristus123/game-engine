import { PersistedObjectsEditor } from '/static/engine/editor/PersistedObjectsEditor.js'; 
import { InvisibleWall } from '/static/engine/mechanics/invisible_walls/InvisibleWall.js'; 

export class InvisibleWallsEditor {
	constructor() {


		this.persisted = new PersistedObjectsEditor(
			'/persisted-objects/invisible_walls.json',
			position => new InvisibleWall(position),
			json => InvisibleWall.mapFromJsonObject(json),
		)
	}

	update() {
		this.persisted.update()
	}

	draw(draw, guiDraw) {
		this.persisted.draw(draw, guiDraw)
	}
}
