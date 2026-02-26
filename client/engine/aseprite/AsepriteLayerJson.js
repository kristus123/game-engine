export class AsepriteLayerJson {
        constructor(json) {
                this.json = json
        }
        forEachFrame(run) {
                Object.entries(this.json.frames).forEach(([key, f]) => {
                        const parts = key.split("_")
                        const layer = parts[0]
                        const frame = parts[1]
                        const tag = parts[2] || "idle"
                        run(layer, frame, f.frame.x, f.frame.y, f.frame.w, f.frame.h, tag)
                })
        }
}
