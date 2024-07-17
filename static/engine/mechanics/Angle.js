export class Angle {
    constructor(angleRange) {
    }

    isWithinAngle(position) {
        const deltaX = position.x - Mouse.position.x
        const deltaY = position.y - Mouse.position.y
        const angleToPoint = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Normalize angle to be within [0, 360)
        const normalizedAngle = (angleToPoint + 360) % 360;

        // Determine if the point is within the specified angle range
        const halfRange = this.angleRange / 2;
        const startAngle = (360 - halfRange) % 360;
        const endAngle = (halfRange) % 360;

        if (startAngle < endAngle) {
            return normalizedAngle >= startAngle && normalizedAngle <= endAngle;
        } else {
            return normalizedAngle >= startAngle || normalizedAngle <= endAngle;
        }
    }
}
