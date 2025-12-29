export class World {
    constructor() {
	SocketClient.onConnect(() => {
		GridUi.mid.add([
                    Html.button('Call', () => {
			const clientId = prompt('Enter Client Id')
			RtcClient.call(clientId)
			console.log('calling...')
                    })
		])

	    GridUi.top.add([
		Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
	    ])
	})

        SocketClient.onDisconnect(() => {
	    console.log(ConnectedSocketClients.ids)
	        GridUi.mid.add([])
	    	GridUi.top.add([
		    Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
		])

        })

	GridUi.right.add([
		Html.button('Answer', () => {
			const clientId = prompt('Enter Client Id')
			RtcClient.acceptCall(clientId)
			console.log('answering...')
		})
	])
    }

    update() {}
    draw(draw) {}
}
