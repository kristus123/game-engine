import { Collision } from '/static/engine/physics/Collision.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export function ConstrainedPosition(position, constrainedPositions) {
    for (const cp of constrainedPositions) {
        if (Collision.between(position, cp)) {
            const clampedX = Math.min(Math.max(position.x, cp.x), cp.x + cp.width);
            const clampedY = Math.min(Math.max(position.y, cp.y), cp.y + cp.height);
            return new Position(clampedX, clampedY);
        }
    }
    return null;
}

