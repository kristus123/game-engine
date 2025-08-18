import { Random } from '/static/engine/Random.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class WalkableAreas {
	constructor(buffer = -80) {

				AssertNotNull(buffer, "argument buffer in " + this.constructor.name + ".js should not be null")
			
		this.buffer = buffer; 

		this.buffer = buffer
		this.rects = []
	}

	add(p) {
		const padded = {
			x: p.x - this.buffer,
			y: p.y - this.buffer,
			width: p.width + 2 * this.buffer,
			height: p.height + 2 * this.buffer
		}
		this.rects.push(padded)
	}

compress() {
    const rects = [...this.rects];
    const result = [];

    function mergeRects(a, b) {
        return {
            x: Math.min(a.x, b.x),
            y: Math.min(a.y, b.y),
            width: Math.max(a.x + a.width, b.x + b.width) - Math.min(a.x, b.x),
            height: Math.max(a.y + a.height, b.y + b.height) - Math.min(a.y, b.y),
        };
    }

    while (rects.length) {
        let r = rects.pop();
        let merged = false;

        for (let i = 0; i < rects.length; i++) {
            const s = rects[i];
            const overlapX = r.x < s.x + s.width && r.x + r.width > s.x;
            const overlapY = r.y < s.y + s.height && r.y + r.height > s.y;

            if (overlapX && overlapY) {
                r = mergeRects(r, s);
                rects.splice(i, 1);
                i = -1; // restart loop to check new merged rect against all others
                merged = true;
            }
        }

        result.push(r);
    }

    this.rects = result;
}

	enforce(o) {
		const insideAny = this.rects.some(r =>
			o.position.x + o.width > r.x &&
			o.position.x < r.x + r.width &&
			o.position.y + o.height > r.y &&
			o.position.y < r.y + r.height
		)

		if (!insideAny) {
			o.position.x = o.previousPosition.x
			o.position.y = o.previousPosition.y
			o.velocity.x = 0
			o.velocity.y = 0
		}
	}

	draw(draw) {
		this.rects.forEach(r => draw.rectangle(r, Random.color()))
	}
}

