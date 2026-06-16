export class SfuTest {
	constructor() {
        SfuClient.streamMode = true

        SfuClient.init()

        this.routerId = ""

        Dom.swapBody([
            H.button("Start Stream", () => {
                SfuClient.createLobby()
            }),
            H.input("StreamID / RouterID", (id) => {
                this.routerId = id
            }),
            H.button("Watch Stream", () => {
                SfuClient.joinLobby(this.routerId)
            })
        ])
	}

	update() {

	}
}
