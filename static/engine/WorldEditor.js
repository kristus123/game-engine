export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			new StaticPicture(new Position(-1000,-1000, 2000, 2000), '/static/assets/beach_64x64.png'),
			new PlayerEditor(),
			new PersistedObjectsEditor(
				'/persisted-objects/chickens.json', 
				position => new Chicken(position), 
				json => {
					const c =  new Chicken(new Position(json.position.x, json.position.y))
					c.objectId = json.objectId
					return c
				},
			),
			// new PersistedObjectsEditor(
			// 	'/persisted-objects/invisible_walls.json', 
			// 	position => new InvisibleWall(position), 
			// 	json => {
			// 		const wall = new InvisibleWall(new Position(json.position.x, json.position.y))
			// 		wall.objectId = json.objectId
			// 		return wall
			// 	},
			// ),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
