function nowPlus(days) {
    const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
    return new Date(Date.now() + days * MILLISECONDS_PER_DAY)
}


export class Practice {
	constructor() {

		Html.clear()

		AudioDb.all(entries => {
			Html.clear()


			const e = Random.choice(entries)
			Sound.playBlob(Base64.decode(e.sound))


			Html.fill([
				Html.div('big', [
					Html.p('playing audio'),
					Html.div('big', [
						Html.button('hard', () => {
							// e.nextReview = nowPlus(0)
							AudioDb.save(e.uuid, e)
						}),
						Html.button('ok', () => {
							e.nextReview = nowPlus(2)
							AudioDb.save(e.uuid, e)
						}),
						Html.button('easy', () => {
							e.nextReview = nowPlus(4)
							AudioDb.save(e.uuid, e)
						}),
					])
				]),
			])


		})
	}
}
