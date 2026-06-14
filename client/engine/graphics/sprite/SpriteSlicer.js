export class SpriteSlicer {
    static slice(sprite, sliceX, sliceY) {
        // TODO: Find A Way To Copy Sprite

        // 1. Crop The Sprites And Store Into Array
        const spritePositions = []

        const testSpriteSize = 32

        for (let x = 0; x < sliceX; x++) {
            for (let y = 0; y < sliceY; y++) {
                const sx = (testSpriteSize / sliceX) * x
                const sy = (testSpriteSize / sliceY) * y
                const sw = testSpriteSize / sliceX
                const sh = testSpriteSize / sliceY
                
                spritePositions.push({
                    sx: sx,
                    sy: sy,
                    sw: sw,
                    sh: sh
                })
            }
        }

        // TODO: Return Sprite Array Instead

        // 2. Return Sprites Position Array
        return spritePositions
    }

    static shuffle(slicedSprites, multiplier) {
        slicedSprites.forEach(sprite => {
            sprite.position = WorldPosition(
                ((Math.random() * 2) - 1) * multiplier, 
                ((Math.random() * 2) - 1) * multiplier
            )
        })
    }
}