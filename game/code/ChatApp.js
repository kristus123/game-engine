// ClientId(

export class ChatApp {
	constructor() {
        this.text = ""
        this.length = 0
        Dom.overlay(Html.div("chat", [
                Html.input('type here', value => {
                    this.text = value
                }),
                Html.button("send", () => {
                    if(this.text != ""){
                        Chat.sendJson({originClientId: ClientId, text: this.text})
                    }else{
                        console.log("no message")
                    }
                })
        ]))

        setInterval(() => {
            console.log("syncing...")
            Chat.getJson(ClientId, (texts) => {
                if (!texts){
                    return
                } else if (this.length == texts.length) {
                    return
                }

                const totalNew = texts.length - this.length
                const newTexts = texts.slice(texts.length - totalNew)

                for (const index in newTexts){
                    const text = newTexts[index]
                    Html.appendBody([
                        Html.p(`${JSON.stringify(text.originClientId)}: ${text.text}`, 'message')
                    ])  
                }

                this.length = texts.length  
            })
        }, 1000)
	}

	update() {

	}
}
