export class Stone extends Entity {
	constructor(position) {
    	super(position)
    	this.objects = Objects([

    	])
	}

	update() {
    	console.log(0)
    	D1.box(this.position)
	}
}