export class World {
	constructor() {
		Page.go(PracticePage)

		this.viking = Sprite.viking(WorldPosition(-800, 0))
		this.player = Sprite.player(WorldPosition(200, 300))
		setInterval(() => {
			SocketClient.sendToOtherClients("DELIVARETLY_UNKNOLWN", {he:1})
		}, 200);
	}

	update() {
		this.viking.update()
		this.player.update()
	}
}
