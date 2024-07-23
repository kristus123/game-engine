export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))
		Controller.control(Cam.objectToFollow)

		this.localObjects = new LocalObjects([
			new PlayerEditor(),
			new StaticPicture(new Position(-100, 0, 1700, 600), '/static/assets/houses.png'),
			new StaticPicture(new Position(-100, -1200, 1700, 600), '/static/assets/houses.png'),
			new PersistedObjectsEditor(
				'/persisted-objects/stone1.json',
				position => new StaticPicture(position.offset(0,0, 180, 100).copy(), '/static/assets/stones/stone1.png'),
				json => {
					const c = new StaticPicture(Position.from(json.position), '/static/assets/stones/stone1.png')
					c.objectId = json.objectId
					return c
				},
			),
			new PersistedObjectsEditor(
				'/persisted-objects/stone2.json',
				position => new StaticPicture(position.offset(0,0, 180, 100).copy(), '/static/assets/stones/stone2.png'),
				json => {
					const c = new StaticPicture(Position.from(json.position), '/static/assets/stones/stone2.png')
					c.objectId = json.objectId
					return c
				},
			),
			new PersistedObjectsEditor(
				'/persisted-objects/stone3.json',
				position => new StaticPicture(position.offset(0,0, 180, 100).copy(), '/static/assets/stones/stone3.png'),
				json => {
					const c = new StaticPicture(Position.from(json.position), '/static/assets/stones/stone3.png')
					c.objectId = json.objectId
					return c
				},
			),
			new PersistedObjectsEditor(
				'/persisted-objects/chickens.json',
				position => new Chicken(position),
				json => {
					const c = new Chicken(new Position(json.position.x, json.position.y))
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
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
