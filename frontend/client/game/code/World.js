export class World {
    constructor() {
        Palette.ambientColor = "#000000"
        Shadow.opacity = 1.0

        // Set global world registry
        G.world = this

        // Set up entities
        this.worldMap = Sprite.world(WorldPosition(0, 0))

        this.player = Player(WorldPosition(950, 420))
        G.player = this.player

        this.oldSami = OldSami()
        this.oldSami.position.x = 730
        this.oldSami.position.y = 600

        this.fireplace = Sprite.fireplace(WorldPosition(850, 580))
        this.fireplace.loopTag("idle")

        this.bushes = [
            Sprite.bush(WorldPosition(500, 400)),
            Sprite.bush(WorldPosition(550, 800)),
            Sprite.bush(WorldPosition(1150, 750))
        ]
        this.bushes.forEach(b => {
            b.loopTag("berries")
            b.slices = []
        })

        this.entities = Objects([
            this.worldMap,
            this.player,
            this.oldSami,
            this.fireplace,
            ...this.bushes
        ])

        // Initial camera setup
        Camera.position.x = 950
        Camera.position.y = 420
        this.cameraTarget = this.player.position
        Camera.follow(this.player.position)

        Controller.control(this.player)

        this.weather = Weather()
        this.quest = DemoQuest()
    }

    update() {
        Camera.smoothing(this.cameraTarget)
        this.entities.update()
        this.quest.update()
        this.weather.update(Season.normal, 0) // No sky/opacity effects

        // Dialogues & Interface
        if (this.dialogue) {
            this.dialogue.update()
        }
    }
}