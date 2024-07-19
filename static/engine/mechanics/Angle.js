export class Angle {
    constructor(playerPosition, angleRange) {
        this.playerPosition = playerPosition;
        this.angleRange = angleRange;

		this.blue = "rgba(0, 0, 255, 0.5)"; // Example color with transparency
		this.color = this.blue
    }

    isWithinAngle(position) {
        const deltaX = position.x - this.playerPosition.x;
        const deltaY = position.y - this.playerPosition.y;
        const angleToPoint = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Normalize angle to be within [0, 360)
        const normalizedAngle = (angleToPoint + 360) % 360;

        // Determine if the point is within the specified angle range
        const halfRange = this.angleRange / 2;
        const mouseAngle = Math.atan2(Mouse.position.y - this.playerPosition.y, Mouse.position.x - this.playerPosition.x) * (180 / Math.PI);
        const normalizedMouseAngle = (mouseAngle + 360) % 360;

        const startAngle = (normalizedMouseAngle - halfRange + 360) % 360;
        const endAngle = (normalizedMouseAngle + halfRange) % 360;

        if (startAngle < endAngle) {
            return normalizedAngle >= startAngle && normalizedAngle <= endAngle;
        } else {
            return normalizedAngle >= startAngle || normalizedAngle <= endAngle;
        }
    }

    draw(ctx) {
        const mousePos = Mouse.position;
        const radius = 160; // Example radius for the arc
        const halfRange = this.angleRange / 2;

        // Determine the angle towards the mouse position
        const mouseAngle = Math.atan2(mousePos.y - this.playerPosition.y, mousePos.x - this.playerPosition.x);
        
        // Calculate the start and end angles in radians
        const startAngleRad = mouseAngle - (halfRange * Math.PI / 180);
        const endAngleRad = mouseAngle + (halfRange * Math.PI / 180);

        // Draw the arc representing the angle range
        ctx.beginPath();
        ctx.moveTo(this.playerPosition.x, this.playerPosition.y);
        ctx.arc(
            this.playerPosition.x,
            this.playerPosition.y,
            radius,
            startAngleRad,
            endAngleRad
        );
        ctx.lineTo(this.playerPosition.x, this.playerPosition.y);
        ctx.fillStyle = this.color
        ctx.fill();
    }
}
