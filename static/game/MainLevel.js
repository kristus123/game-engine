function snapGrid(mousePosition, cellSize) {

            // Calculate the cell coordinates
            const cellX = Math.floor(mousePosition.x / cellSize);
            const cellY = Math.floor(mousePosition.y / cellSize);

            // Calculate the adjusted mouse position within the cell
            const adjustedX = cellX * cellSize + cellSize / 2;
            const adjustedY = cellY * cellSize + cellSize / 2;

            return new Position(adjustedX, adjustedY, cellSize, cellSize);
        }

function drawGrid(context, gridSize, offsetX=0, offsetY=0) {
    context.strokeStyle = 'white';
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;
    const cellSize = gridSize;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let x = offsetX; x < canvasWidth; x += cellSize) {
        for (let y = offsetY; y < canvasHeight; y += cellSize) {
            context.strokeRect(x, y, cellSize, cellSize);
        }
    }
}
export class MainLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)
		this.mouse = mouse

		this.npc = new Npc()

		this.levelSelector = levelSelector

		this.piss = new Piss(this.world.player, mouse, new Position(-1000, 100, 100, 100))
		this.piss.onFinish = () => {
			levelSelector.changeActiveLevel(new DeliverPissLevel(this.world, this.npc, levelSelector))
		}

		this.runAll = new RunAll([
			this.world,
			this.npc,
			this.piss,
			new FirstChat(this.npc.position, this.piss, mouse)
		])
	}

	update() {
		// this.levelSelector.changeActiveLevel(new ShootChickensLevel(this.world))
		this.runAll.update()
	}

	draw(draw) {
            const cellSize = 64;
		const snappedPosition = snapGrid(this.mouse.position, cellSize)
		drawGrid(draw.ctx, cellSize, cellSize*10, cellSize*10)

            // Highlight nearby cell
            draw.ctx.fillStyle = 'white';
            draw.ctx.fillRect(
                snappedPosition.x - snappedPosition.width / 2,
                snappedPosition.y - snappedPosition.height / 2,
                snappedPosition.width,
                snappedPosition.height
            );



		// draw.new_rectangle(grid)

		this.runAll.draw(draw)
	}
}
