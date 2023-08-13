function resolveCollision(main, child) {
    const dx = (main.x + main.width / 2) - (child.x + child.width / 2);
    const dy = (main.y + main.height / 2) - (child.y + child.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    const overlapX = (main.width + child.width) / 2 - Math.abs(dx);
    const overlapY = (main.height + child.height) / 2 - Math.abs(dy);

    if (overlapX > overlapY) {
        if (dy > 0) {
            main.y += overlapY;
            child.y -= overlapY;
        } else {
            main.y -= overlapY;
            child.y += overlapY;
        }
        main.velocity.y = -main.velocity.y;
        child.velocity.y = -child.velocity.y;
    } else {
        if (dx > 0) {
            main.x += overlapX;
            child.x -= overlapX;
        } else {
            main.x -= overlapX;
            child.x += overlapX;
        }
        main.velocity.x = -main.velocity.x;
        child.velocity.x = -child.velocity.x;
    }


	const dampingFactor = 0.5
	const stopThreshold = 10

	main.velocity.x *= dampingFactor;
	main.velocity.y *= dampingFactor;
	console.log(main.velocity.x, main.velocity.y)

	// Check if velocity is below the threshold and set it to zero
    if (Math.abs(main.velocity.x) < stopThreshold) {
        main.velocity.x = 0;
    }
    if (Math.abs(main.velocity.y) < stopThreshold) {
        main.velocity.y = 0;
    }
}






class Physics {
	constructor() {
		this.objects = []
	}

	add(o) {
		this.objects.push(o)
	}


	update() {
		for (let mainObject of this.objects) {

			for (let childObject of this.objects) {
				if (Collision.between(mainObject, childObject) && mainObject !== childObject) {
					resolveCollision(mainObject, childObject)
				}

			}
		}
	}

	draw(ctx) {
		
	}
}
