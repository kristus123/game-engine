// ClientId(

export class World {
    constructor() {
	    this.callButton = [
                    Html.button('call', () => {
			RtcClient.call("15527fcb-1c65-4237-bb1a-2854e5053342") // Id In Private Window
			console.log('calling...')
                    })
	    ]

	    this.answerButton = [
                    Html.button('answer', () => {
			RtcClient.acceptCall("ce0656cc-850d-4b10-9f90-a7f81be3e34b") // Id In Normal Window
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
