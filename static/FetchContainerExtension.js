import { Draw } from '/static/Draw.js';
import { GameObject } from '/static/GameObject.js';
import { Distance } from '/static/Distance.js';

export class FetchContainerExtension {
    constructor(spaceship) {
        this.spaceship = spaceship;

        this.container = new GameObject(100, 100, 100, 100, 10, 10);
        this.connectedToSpaceship = false;
        this.ropeLength = 200; // Set your desired rope length here
        this.minDistanceForDangle = 200; // Set the minimum distance for dangle
    }

    update() {
        if (this.connectedToSpaceship) {
            // Container follows the spaceship only if it's far enough
            const distanceToSpaceship = Distance.calculateDistance(this.container, this.spaceship);

            if (distanceToSpaceship > this.minDistanceForDangle) {
                const angle = Math.atan2(this.spaceship.y - this.container.y, this.spaceship.x - this.container.x);
                this.container.x = this.spaceship.x - this.ropeLength * Math.cos(angle);
                this.container.y = this.spaceship.y - this.ropeLength * Math.sin(angle);
            }
        }
		else if (Distance.withinRadius(this.container, this.spaceship, this.ropeLength)) {
            this.connectedToSpaceship = true;
        }
    }

    draw(ctx) {
        if (this.connectedToSpaceship) {
            Draw.lineBetween(ctx, this.spaceship, this.container);
        }

        this.container.draw(ctx);
    }
}

