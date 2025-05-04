export class _GameObject { // _ means it is only meant to be extended, not used directly
	constructor(position) {

		this.position = position.copy()

		this._objectId = Random.uuid()
	}

	touches(o) {
		return Collision.between(this.position, o)
	}

	touchesAny(list, condition= (o) => true) {
		if (AnArray(list)) for (const o of list) {
			if (Collision.between(this.position, o) && this != o && condition(o)) {
				return o
			}
		}

		return null
	}

  enforceDistance(o) {
    // centers
    const cx1 = this.x + this.width / 2;
    const cy1 = this.y + this.height / 2;
    const cx2 = o.x + o.width / 2;
    const cy2 = o.y + o.height / 2;

    // distance between centers
    const dx = cx2 - cx1;
    const dy = cy2 - cy1;

    // overlap on each axis
    const overlapX = ((this.width + o.width) / 2 - Math.abs(dx)) +1
    const overlapY = ((this.height + o.height) / 2 - Math.abs(dy)) +1

    if (overlapX > 0 && overlapY > 0) {
      // resolve in the shortest direction
      if (overlapX < overlapY) {
        o.x += dx > 0 ? overlapX : -overlapX;
      } else {
        o.y += dy > 0 ? overlapY : -overlapY;
      }
    }
  }

	distance(o) {
		return Distance.between(this, o)
	}

	closest(objects) {
		if (List.empty(objects)) {
			return null
		}
		else {
			let closestObject = objects[0]
			
			for (const o of objects) {
				if (this.distance(closestObject) > this.distance(o)) {
					this.closestObject = o
				}
			}
		}


		return closestObject
	}

	closestWithin(distance, objects) {
		let closestObject = this.closest(objects)
		
		if (this.within(distance, closestObject)) {
			return closestObject
		}
		else {
			return null
		}

	}

	within(distance, o) {
		return Distance.within(distance, this, o)
	}

	notWithin(distance, o) {
		return Distance.notWithin(distance, this, o)
	}

	get objectId() {
		//if (this._objectId) {
		return this._objectId
		//}
		//else {
		//	throw new Error('objectId is not set, make sure you have set it')
		//}
	}

	set objectId(x) {
		this._objectId = x
	}

	get x() {
		return this.position.x
	}

	get y() {
		return this.position.y
	}

	set x(x) {
		this.position.x = x
	}

	set y(y) {
		this.position.y = y
	}

	get width() {
		return this.position.width
	}

	get height() {
		return this.position.height
	}

	set width(w) {
		this.position.width = w
	}

	set height(h) {
		this.position.height = h
	}

	update() {
	}

	draw(draw, guiDraw) {
		draw.rectangle(this)
	}

}
