export class Noise {
    constructor() {
        const simplex = new SimplexNoise();

        this.mapWidth = 100;
        this.mapHeight = 100;
        
        this.image = [];
        for (let x = 0; x < this.mapWidth; x++) {
            this.image[x] = [];
            for (let y = 0; y < this.mapHeight; y++) {
                const position = new Position(x, y);
                const value = simplex.noise(position.x / 100, position.y / 100);
                this.image[x][y] = {
                    position: position,
                    value: Math.abs(value) * 256 
                };
            }
        }
    }

    draw(draw, guiDraw) {
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const position = this.image[x][y].position;
                const value = this.image[x][y].value / 256;
                const color = value < 0.2 ? 'blue' : 'green';
                draw[color](position);
            }
        }
    }
}
