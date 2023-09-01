import { Palette } from '/static/Palette.js'

const spaceship = new Image();
spaceship.src = "https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png";


const playerImage = new Image();
playerImage.src = "https://www.nicepng.com/png/full/343-3434119_overworld-pokemon-trainer-fusion-with-hydreigon-pokemon-red.png";

export class Draw {
	static rectangle(ctx, x, y, width, height) {
		ctx.fillStyle = "orange"
		ctx.fillRect(x, y, width, height)

		ctx.strokeStyle = "white"
		ctx.lineWidth = 4;
		ctx.strokeRect(x, y, width, height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
	}

	static circle(ctx, x, y, radius, color) {
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2, false)
		ctx.fillStyle = color
		ctx.fill()
	}

	static hollowCircle(ctx, x, y, radius) {
		ctx.strokeStyle = 'red'
		ctx.lineWidth = 20

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.stroke();
	}

	// todo must be updated somehow iwthin game lloop
	static circleSpinning(ctx, objectToFollow, radius) {
		let angle = 0

		const x = objectToFollow.x + objectToFollow.width / 2 + radius * Math.cos(angle);
		const y = objectToFollow.y + objectToFollow.height / 2 + radius * Math.sin(angle);

		Draw.circle(ctx, x, y, 10, "red");

		angle += 0.25
	}

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePositionButBehind() {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1);
		}

		player.angle = 0
		const playerRadius = 20;
		const circleRadius = 50;
		const color = "blue";

		const oppositeAngle = player.angle + Math.PI
		const circleX = player.x + player.width / 2 + circleRadius * Math.cos(oppositeAngle);
		const circleY = player.y + player.height / 2 + circleRadius * Math.sin(oppositeAngle);
		Draw.circle(ctx, circleX, circleY, playerRadius, "red");

		player.angle = getAngle(player.x + player.width / 2, player.y + player.height / 2, camera.currentMousePosition.x, camera.currentMousePosition.y);

	}


static objectThatIsMovingInRectangularPathAroundObject(ctx, player, currentMousePosition) {
    function getAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    const playerWidth = player.width;
    const playerHeight = player.height;
    const playerCenterX = player.x + playerWidth / 2;
    const playerCenterY = player.y + playerHeight / 2;

    const mouseX = currentMousePosition.x;
    const mouseY = currentMousePosition.y;

    // Calculate distances from player's center to mouse position
    const dx = mouseX - playerCenterX;
    const dy = mouseY - playerCenterY;

    // Calculate the maximum allowed distances for rectangular movement
    const horizontalRectDistance = 500;
    const verticalRectDistance = 200;

    // Calculate the position for the circle to move in a rectangular path
    let circleX = playerCenterX + Math.min(Math.abs(dx), horizontalRectDistance) * Math.sign(dx);
    let circleY = playerCenterY + Math.min(Math.abs(dy), verticalRectDistance) * Math.sign(dy);

    // Draw the circle
    const playerRadius = 20;
    Draw.circle(ctx, circleX, circleY, playerRadius, "red");

    // Draw the rectangle
    const rectX = playerCenterX - horizontalRectDistance;
    const rectY = playerCenterY - verticalRectDistance;
    const rectWidth = horizontalRectDistance * 2;
    const rectHeight = verticalRectDistance * 2;

    ctx.strokeStyle = "blue";
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
}

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePosition(ctx, player, currentMousePosition) {
		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1)
		}

		const angle = getAngle(player.x, player.y, currentMousePosition.x, currentMousePosition.y)
		const playerRadius = 20
		const circleRadius = 200

		const circleX = player.x + player.width /2 + circleRadius * Math.cos(angle);
		const circleY = player.y + player.height /2 + circleRadius * Math.sin(angle);

		Draw.circle(ctx, circleX, circleY, playerRadius, "red");
	}

	static lineBetween(ctx, start, end) {
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.strokeStyle = "white"
		ctx.lineWidth = 5
		ctx.stroke();
	}

	static text(ctx, x, y, width, height, text) {
		Draw.rectangle(ctx, x, y, width, height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
		ctx.fillText(text, x + 20, y + height / 2)
	}

	static spaceship(ctx, player) {

		const aspectRatio = spaceship.width / spaceship.height;

		const maxWidth = 500;
		const maxHeight = 200;

		let newWidth = maxWidth;
		let newHeight = maxHeight;

		if (spaceship.width > maxWidth) {
			newWidth = maxWidth;
			newHeight = newWidth / aspectRatio;
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight;
			newWidth = newHeight * aspectRatio;
		}

		ctx.save();

		ctx.translate(player.x, player.y);
		const rotationAngle = Math.atan2(player.velocity.y, player.velocity.x);
		ctx.rotate(rotationAngle);
		ctx.rotate(Math.PI / 2); // 90 degrees

		ctx.drawImage(spaceship, -newWidth / 2, -newHeight / 2, newWidth, newHeight);

		ctx.restore();
	}

	static player(ctx, player) {

		const aspectRatio = playerImage.width / playerImage.height;

		const maxWidth = 50;
		const maxHeight = 200;

		let newWidth = maxWidth;
		let newHeight = maxHeight;

		if (playerImage.width > maxWidth) {
			newWidth = maxWidth;
			newHeight = newWidth / aspectRatio;
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight;
			newWidth = newHeight * aspectRatio;
		}

		ctx.save();

		ctx.translate(player.x, player.y);
		// const rotationAngle = Math.atan2(player.velocity.y, player.velocity.x);
		// ctx.rotate(rotationAngle);
		// ctx.rotate(Math.PI / 2); // 90 degrees

		ctx.drawImage(playerImage, -newWidth / 2, -newHeight / 2, newWidth, newHeight);

		ctx.restore();
	}









	static grid(ctx) {
		ctx.strokeStyle = "#ccc"; // Grid color
		ctx.lineWidth = 2

		const cellSize = 100; // Adjust this to change the grid cell size
		const mapWidth = 1000; // Adjust this to match your map's width
		const mapHeight = 1000; // Adjust this to match your map's height
		const rows = Math.floor(mapHeight / cellSize);
		const columns = Math.floor(mapWidth / cellSize);

		for (let i = 0; i < rows; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * cellSize);
			ctx.lineTo(mapWidth, i * cellSize);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.moveTo(0, mapHeight);
		ctx.lineTo(mapWidth, mapHeight);
		ctx.stroke();

		for (let j = 0; j < columns; j++) {
			ctx.beginPath();
			ctx.moveTo(j * cellSize, 0);
			ctx.lineTo(j * cellSize, mapHeight);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.moveTo(mapWidth, 0);
		ctx.lineTo(mapWidth, mapHeight);
		ctx.stroke();
	}


static sprite() {
    const spriteSheet = new Image();
    spriteSheet.src = "static/player.png";

    const frameWidth = 50; // Width of each frame in the sprite sheet
    const frameHeight = 37; // Height of each frame in the sprite sheet
    const scale = 10; // Scale factor

    const frameSequence = [
        { x: 2, y: 6 }  ,// Frame 2
        // Add more frames as needed
    ];

    let currentFrameIndex = 0; // Index of the current frame in frameSequence
    const totalFrames = frameSequence.length;

	setInterval(() => {
        currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
	}, 120);

    const x = 0;
    const y = 0;

    return function drawFrame(ctx) {
        const frameInfo = frameSequence[currentFrameIndex];
        const currentFrameX = frameInfo.x;
        const currentFrameY = frameInfo.y;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            spriteSheet,
            currentFrameX * frameWidth,
            currentFrameY * frameHeight,
            frameWidth,
            frameHeight,
            x,
            y,
            frameWidth * scale,
            frameHeight * scale
        );

    };

}





	// this is not in use
	static fill(ctx, color) {
		ctx.fillStyle = color
		ctx.fillRect(0, 0, Palette.width, Palette.height)
	}
}
