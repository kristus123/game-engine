export const index = 'this is needed or else shit will crash'

const mainPalette = Palette.main()
const guiPalette = Palette.offscreen()
const backgroundPalette = Palette.offscreen()
const starBackground = new StarBackground()

const camera = new Camera()
const mouse = new Mouse(camera)

let objectToFollow = { x: 0, y: 0 }
const cameraFollow = (f) => (objectToFollow = f)

const level = new MainLevel(cameraFollow, mouse)

Loop.everyFrame((deltaTime) => {
	Palette.clear([camera.palette, guiPalette])

	Physics.global.update(deltaTime)

	camera.context(() => {
		camera.follow(objectToFollow) // Keep this after physics.update and within camera.context
		level.update()
		level.draw(camera.palette.ctx)
	})

	starBackground.draw(objectToFollow)

	Palette.fill(backgroundPalette, 'black')
	Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
	Palette.apply(mainPalette, [backgroundPalette, starBackground.palette, camera.palette, guiPalette])
})
