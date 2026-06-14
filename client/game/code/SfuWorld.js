export class SfuWorld {
	constructor() {
		VideoCamera.request(async (ok) => {
			if (ok) {
				await SfuClient.init()
				SfuClient.createLobby()
			}
			else {
				throw new Error("explosion")
			}
		})
	}

	update() {
		
	}
}
