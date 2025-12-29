export class GridUi {
	static {
		this.top    = GridUi.expose(Html.div('grid-top'))
		this.left   = GridUi.expose(Html.div('grid-left'))
		this.right  = GridUi.expose(Html.div('grid-right'))
		this.mid    = GridUi.expose(Html.div('grid-mid'))
		this.bottom = GridUi.expose(Html.div('grid-bottom'))

		console.log(this.top)
		
		Ui.overlay([
			Html.div('grid', [
				this.top.node,
				this.left.node,
				this.right.node,
				this.mid.node,
				this.bottom.node
			])
		])
	}
	
	static expose(node) {
		return {
			add(value) {
               			Html.removeChildElements(node)	
				for (const v of Always.list(value)) {
                			node.appendChild(v)
            			}
        		},
              		node
    		}
	}
}
