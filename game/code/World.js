// ClientId(

export class World {
    constructor() {
	    this.callerId = null
	    
	    this.callButton = [
                    Html.button('call', () => {
			RtcClient.call(this.callerId)
			console.log('calling...')
                    })
	    ]

	    this.answerButton = [
                    Html.button('answer', () => {
			RtcClient.acceptCall()
			console.log('answering...')
                    })
	    ]

	    SocketClient.onConnect((d) => {
		    GridUi.top.add([
			    Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
		    ])

		    GridUi.left.push([
                    	Html.button(d.originClientId, () => {
				this.callerId = d.originClientId
				console.log('callerId set')
                    	})
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
