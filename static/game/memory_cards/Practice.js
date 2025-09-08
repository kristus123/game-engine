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
                        Html.button('again', () => {
                            e.nextReview = nowPlus(0)
                            AudioDb.save(e.uuid, e)
                            new Practice()
                        }),
                        Html.button('hard', () => {
                            e.nextReview = nowPlus(1)
                            AudioDb.save(e.uuid, e)
                            new Practice()
                        }),
                        Html.button('ok', () => {
                            e.nextReview = nowPlus(2)
                            AudioDb.save(e.uuid, e)
                            new Practice()
                        }),
                        Html.button('good', () => {
                            e.nextReview = nowPlus(3)
                            AudioDb.save(e.uuid, e)
                            new Practice()
                        }),
                        Html.button('EZ', () => {
                            e.nextReview = nowPlus(3)
                            AudioDb.save(e.uuid, e)
                            new Practice()
                        }),
                    ])
                ]),
            ])
        })
    }

    important(entries) {
        const now = Date.now()
        return entries.filter(e => !e.nextReview || new Date(e.nextReview).getTime() <= now)
    }
}

