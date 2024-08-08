export class NormalMapPicture {
    constructor(position, normalMapPath) {
        this.position = position;

        // Load the normal map
        this.normalMap = new Image();
        this.normalMap.src = normalMapPath;

        // Lighting parameters
        this.lightPosition = {x:200, y:100}; // Center light source
        this.lightColor = { r: 255, g: 255, b: 255 };
        this.ambientLight = 0.3; // Increased ambient light for visibility
    }

    draw(draw) {
        if (this.normalMap.complete) {
            const newWidth = this.position.width;
            const newHeight = this.position.height;

            draw.ctx.imageSmoothingEnabled = false;

            draw.ctx.save();
            draw.ctx.translate(this.position.x, this.position.y);

            // Get the image data of the area where the image is drawn
            const imageData = draw.ctx.getImageData(this.position.x, this.position.y, newWidth, newHeight);

            // Get normal map data
            const normalData = this.getNormalData(draw, newWidth, newHeight);

            // Apply lighting
            this.applyLighting(imageData, normalData);

            // Put the modified image data back to the canvas
            draw.ctx.putImageData(imageData, this.position.x, this.position.y);

            draw.ctx.restore();
        }
    }

    getNormalData(draw, width, height) {
        draw.ctx.drawImage(this.normalMap, this.position.x, this.position.y, width, height);
        return draw.ctx.getImageData(this.position.x, this.position.y, width, height);
    }

    applyLighting(imageData, normalData) {
        const data = imageData.data;
        const normal = normalData.data;
        const lightX = this.lightPosition.x - this.position.x;
        const lightY = this.lightPosition.y - this.position.y;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % imageData.width;
            const y = Math.floor((i / 4) / imageData.width);

            // Get normal map values
            const nx = normal[i] / 255 * 2 - 1;
            const ny = normal[i + 1] / 255 * 2 - 1;
            const nz = normal[i + 2] / 255 * 2 - 1;

            // Compute light direction
            const lx = lightX - x;
            const ly = lightY - y;
            const lz = 100; // Example light source height
            const length = Math.sqrt(lx * lx + ly * ly + lz * lz);
            const ld = { x: lx / length, y: ly / length, z: lz / length };

            // Dot product of normal and light direction
            const dot = Math.max(0, nx * ld.x + ny * ld.y + nz * ld.z);

            // Apply the lighting effect
            const r = this.lightColor.r * dot + data[i] * this.ambientLight;
            const g = this.lightColor.g * dot + data[i + 1] * this.ambientLight;
            const b = this.lightColor.b * dot + data[i + 2] * this.ambientLight;

            data[i] = Math.min(255, r);
            data[i + 1] = Math.min(255, g);
            data[i + 2] = Math.min(255, b);
        }
    }
}

