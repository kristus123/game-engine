export const index = ''

function loadImage(pngPath) {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = pngPath
		img.onerror = reject

		if (img.complete) {
			resolve(img)
		}
		else {
			img.onload = () => resolve(img)
		}
	})
}


async function loadAudio(url) {
	try {
		const r = await fetch(url)
		const arrayBuffer = await r.arrayBuffer()
		return await AudioContext.decodeAudioData(arrayBuffer)
	}
	catch (err) {
		console.error('Error loading audio:', err)
		return null
	}
}



const whenLoaded = Promise.all(ASEPRITE_FILES.map(path => {
	if (path.includes('.json')) {
		return Promise.resolve('ok')
	}


	const fileName = path.split('/').pop()
	const pngPath = path + '.png'
	const asepriteJson = new AsepriteJson(StaticHttp.get(path + '.json'))

	const asepriteLayerJson = new AsepriteLayerJson(StaticHttp.get(path + 'Layers' + '.json'))

	const spriteLayers = loadImage(path + 'Layers.png')
		.then(img => G.SpriteLayers[fileName] = (pos) => new SpriteLayers(pos, img, asepriteLayerJson))

	const sprite = loadImage(pngPath)
		.then(img => G.Sprite[fileName] = (pos) => new Sprite(pos, img, asepriteJson))

	const image = loadImage(pngPath)
		.then(img => G.image[fileName] = img)

	const audios = [
		'/static/audio/sheet.mp3',
		'/static/audio/click.mp3',
	].map(a => loadAudio(a).then(xxx => {
		G.Audio[a.split('/').pop().replace('.mp3', '')] = xxx
	}))

	return Promise.all([spriteLayers, sprite, image, ...audios])
}))


whenLoaded.then(() => {
	const mainPalette = Palette.main()
	const guiPalette = Palette.offscreen()
	const backgroundPalette = Palette.offscreen()
	// const showLogs = new ShowLogs(guiPalette)

	Sound.init()
	Mouse.initialize()
	Camera.initialize()
	Mouse.initializeAfterCameraIsInitialized()

	const draw = new Draw(Camera.palette.ctx)
	const guiDraw = new Draw(guiPalette.ctx)

	Level.change(new World())

	//new VideoCall()

	Loop.everyFrame(deltaTime => {
		ErrorHandler.run(() => {

			Camera.palette.clear()
			guiPalette.clear()

			Physics.update(deltaTime)

			Camera.context(() => {

				Controller.update()
				Controller.draw(draw, guiDraw)

				Level.update()
				Level.draw(draw, guiDraw)

				Mouse.update()
				Mouse.draw(draw, guiDraw)
			})

			// showLogs.draw()

			backgroundPalette.fill('#10204f')

			mainPalette.apply(backgroundPalette)
			mainPalette.apply(Camera.palette)
			mainPalette.apply(guiPalette)
		})
	})
})
	.catch(err => {
		console.error('Image failed to load', err)
		throw err
	})
