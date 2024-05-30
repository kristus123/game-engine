function ObjectClass(params, methods) {
  const instance = {};
  
  // Define methods dynamically based on the provided methods
  Object.entries(methods).forEach(([methodName, method]) => {
    instance[methodName] = () => method(params);
  });

  // Prepare the draw method to be called later
  instance.draw = (draw, guiDraw) => {
    methods.draw(draw, guiDraw, params);
  };

  return instance;
}

export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.onlineObjects = new OnlineObjects(this.player)

		this.localObjects = new LocalObjects([
			// this.deliveryDrone,
			new StarBackground(camera),
			new Planet(500, 0),
			this.onlineObjects,
			this.player,
			new OnlinePlayers(this.player, camera),
			new Quest([
				new CollectChickensQuest(mouse, this.player, this.onlineObjects.chickens),
				ObjectClass(
					{
						deliveryZone: new DeliveryZone(new Position(100, 0, 100, 100), [this.player]),
					},
					{
						completed: (params) => params.deliveryZone.amountDelivered == 1,
						update: (params) => {
							params.deliveryZone.update()
						},
						draw: (draw, guiDraw, params) => {
							params.deliveryZone.draw(draw, guiDraw)
						},
					}
				),
			]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
