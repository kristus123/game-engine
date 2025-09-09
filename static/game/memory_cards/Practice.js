function nowPlus(days) {
	const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
	return new Date(Date.now() + days * MILLISECONDS_PER_DAY)
}

export class Practice {
	constructor() {
		Html.clear()
		AudioDb.all(entries => {
			Html.clear()
			const important = this.important(entries)
			if (important.length) {
				const e = Random.choice(important)
				Sound.playBlob(Base64.decode(e.sound))
				Html.fill([
					Html.div('big', [
						Html.p('playing audio'),
						Html.button('replay', () => {
							Sound.playBlob(Base64.decode(e.sound))
						}),
						Html.div('big', [
							Html.button('hard', () => this.review(e, 'hard')),
							Html.button('ok', () => this.review(e, 'ok')),
						])
					]),
				])
			}
			else {
				Html.fill([Html.div('big', [
					Html.p('No cards to review'),
					Html.button('go back', () => {
						new Menu()
					}),
				])])
			}
		})
	}

	important(entries) {
		const now = Date.now()
		return entries.filter(e => !e.nextReview || new Date(e.nextReview).getTime() <= now)
	}

	review(e, grade) {
		e.repetitions ??= 0
		e.interval ??= 0

		if (grade === 'hard') {
			e.repetitions = 0
			e.interval = 0
		}
		else if (grade === 'ok') {
			e.repetitions += 1
			e.interval = e.repetitions === 1 ? 1 : e.interval * 2
		}

		e.nextReview = nowPlus(e.interval)
		AudioDb.save(e.uuid, e)

		Html.clear()
		Html.fillList([
			Html.div('big', [
				Html.p(e.title),
			]),
			Html.button('next', () => {
				new Practice()
			})
		])
	}
}

