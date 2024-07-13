export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))
		Controller.control(Cam.objectToFollow),

		this.localObjects = new LocalObjects([
			new StaticPicture(new Position(-1000,-1000, 2000, 2000), '/static/assets/beach_64x64.png'),
			{ player: new PlayerEditor() },
			new PersistedObjectsEditor(
				'/persisted-objects/chickens.json', 
				position => new Chicken(position), 
				json => {
					const c =  new Chicken(new Position(json.position.x, json.position.y))
					c.objectId = json.objectId
					return c
				},
			),
			new PersistedObjectsEditor(
				'/persisted-objects/invisible_walls.json', 
				position => new InvisibleWall(position), 
				json => {
					const wall = new InvisibleWall(new Position(json.position.x, json.position.y))
					wall.objectId = json.objectId
					return wall
				},
			),
		], this)

		this.localObjects.add(new MultiTextTyper(this.player.player.position.offset(0, -100), [
			'JEG ER TOM FOR RIS',
			'Jeg får plukke opp alt jeg finner',
		]))
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
