// ClientId(

export class World {
    constructor() {
	    this.callButton = [
                    Html.button('call', () => {
			const clientId = prompt('enter client id')
			RtcClient.call(clientId)
			console.log('calling...')
                    })
	    ]

	    this.answerButton = [
                    Html.button('answer', () => {
			const clientId = prompt('enter client id')
			RtcClient.acceptCall(clientId)
			console.log('answering...')
                    })
	    ]

	    SocketClient.onConnect(() => {
		    GridUi.top.add([
			    Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
		    ])
		    if (ConnectedSocketClients.ids.length > 1) {
		    	GridUi.mid.add(this.callButton)
		    }
		})

	    SocketClient.onDisconnect(() => {
	        GridUi.mid.add([])
	    	GridUi.top.add([
		    Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
		])
	    })

	    GridUi.right.add(this.answerButton)
	    
	    GridUi.top.add([
		    Html.p("[]", 'noClass')
	    ])
    }

    update() {}

    draw(draw) {}
}
