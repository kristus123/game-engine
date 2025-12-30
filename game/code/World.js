// ClientId(

export class World {
<<<<<<< HEAD
    constructor() {
	    this.callerId = null
	    
	    this.callButton = [
                    Html.button('call', () => {
			RtcClient.call(this.callerId)
			console.log('calling...')
                    })
	    ]
||||||| parent of e5597f20 (fix)
    constructor() {
	    this.callButton = [
                    Html.button('call', () => {
			RtcClient.call("15527fcb-1c65-4237-bb1a-2854e5053342") // Id In Private Window
			console.log('calling...')
                    })
	    ]
=======
	constructor() {
		this.callerId = null
>>>>>>> e5597f20 (fix)

<<<<<<< HEAD
	    this.answerButton = [
                    Html.button('answer', () => {
			RtcClient.acceptCall()
			console.log('answering...')
                    })
	    ]
||||||| parent of e5597f20 (fix)
	    this.answerButton = [
                    Html.button('answer', () => {
			RtcClient.acceptCall("ce0656cc-850d-4b10-9f90-a7f81be3e34b") // Id In Normal Window
			console.log('answering...')
                    })
	    ]
=======
		this.callButton = [
        			Html.button('call', () => {
				RtcClient.call(this.callerId)
				console.log('calling...')
        			})
		]
>>>>>>> e5597f20 (fix)

<<<<<<< HEAD
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
||||||| parent of e5597f20 (fix)
	    SocketClient.onConnect(() => {
		    GridUi.top.add([
			    Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
		    ])
		    if (ConnectedSocketClients.ids.length > 1) {
		    	GridUi.mid.add(this.callButton)
		    }
=======
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
>>>>>>> e5597f20 (fix)
		})

		SocketClient.onDisconnect(() => {
			GridUi.mid.add([])
			GridUi.top.add([
				Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
			])
		})

		GridUi.right.add(this.answerButton)

		GridUi.top.add([
			Html.p('[]', 'noClass')
		])
	}

	update() {}

	draw(draw) {}
}
