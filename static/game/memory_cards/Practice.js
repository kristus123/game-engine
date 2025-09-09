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
    		if (!important.length) {
        		Html.fill([Html.div('big', [Html.p('No cards to review')])])
        		return
    		}

    		const e = Random.choice(important)
    		Sound.playBlob(Base64.decode(e.sound))
    		Html.fill([
        		Html.div('big', [
            		Html.p('playing audio'),
            		Html.button('replay', () => {
                		Sound.playBlob(Base64.decode(e.sound))
            		}),
            		Html.div('big', [
                		Html.button('again', () => this.review(e, 'again')),
                		Html.button('hard', () => this.review(e, 'hard')),
                		Html.button('ok', () => this.review(e, 'ok')),
                		Html.button('good', () => this.review(e, 'good')),
                		Html.button('EZ', () => this.review(e, 'easy')),
            		])
        		]),
    		])
		})
	}

	important(entries) {
		const now = Date.now()
		return entries.filter(e => !e.nextReview || new Date(e.nextReview).getTime() <= now)
	}

	review(e, grade) {
		e.repetitions = e.repetitions || 0
		e.interval = e.interval || 0
		e.ease = e.ease || 2.5

		if (grade === 'again') {
    		e.repetitions = 0
    		e.interval = 1
		}
		else if (grade === 'hard') {
    		e.ease = Math.max(1.3, e.ease - 0.15)
    		e.repetitions += 1
    		e.interval = e.repetitions === 1 ? 1 : Math.round(e.interval * 1.2)
		}
		else if (grade === 'ok') {
    		e.repetitions += 1
    		e.interval = e.repetitions === 1 ? 1 : Math.round(e.interval * e.ease)
		}
		else if (grade === 'good') {
    		e.repetitions += 1
    		e.interval = e.repetitions === 1 ? 2 : Math.round(e.interval * e.ease)
    		e.ease = Math.min(2.5, e.ease + 0.05)
		}
		else if (grade === 'easy') {
    		e.repetitions += 1
    		e.interval = e.repetitions === 1 ? 4 : Math.round(e.interval * e.ease * 1.3)
    		e.ease = Math.min(2.5, e.ease + 0.15)
		}

		e.nextReview = nowPlus(e.interval)
		AudioDb.save(e.uuid, e)
		new Practice()
	}
}

