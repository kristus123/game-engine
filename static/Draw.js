
		const image = new Image();
		image.src = "https://www.nicepng.com/png/full/13-138961_vector-spaces-ship-8-bit-spaceship-sprite.png";

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

		const circleX = objectToFollow.x + objectToFollow.width / 2 + radius * Math.cos(angle);
		const circleY = objectToFollow.y + objectToFollow.height / 2 + radius * Math.sin(angle);

		Draw.circle(ctx, circleX, circleY, 10, "red");

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

	// needs some work obviously, but it works
	static objectThatIsCirclingAroundObjectBasedOnMousePosition() {
		player.angle = 0
		const playerRadius = 20;
		const circleRadius = 50;
		const color = "blue";

		const circleX = player.x + player.width /2 + circleRadius * Math.cos(player.angle);
		const circleY = player.y + player.height /2 + circleRadius * Math.sin(player.angle);

		Draw.circle(ctx, circleX, circleY, playerRadius, "red");

		function getAngle(x1, y1, x2, y2) {
			return Math.atan2(y2 - y1, x2 - x1);
		}

		player.angle = getAngle(player.x, player.y, camera.currentMousePosition.x, camera.currentMousePosition.y);
	}

	static lineBetween(ctx, start, end) {
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.strokeStyle = "white"
		ctx.stroke();
	}



	static text(ctx, x, y, width, height, text) {
		Draw.rectangle(ctx, x, y, width, height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
		ctx.fillText(text, x + 20, y + height / 2)
	}

	// currently only for player
	// . this solution flickers because of constntlyu doing new ImagE()
	static image(ctx, player) {

		const aspectRatio = image.width / image.height;

		const maxWidth = 500;
		const maxHeight = 200;

		let newWidth = maxWidth;
		let newHeight = maxHeight;

		if (image.width > maxWidth) {
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

		ctx.drawImage(image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);

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
}
