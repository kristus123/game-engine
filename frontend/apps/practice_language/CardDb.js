// I tried to remove this class but it is used in multiple files
// and it is wise to keep the schema in the same place so this card has an okay purpose

export async function CardDb() {

	const db = await Db("jap", {
		enhancer: c => {

			c.practiceSide = () => {
				if (c.front.dueDate.isDue()) {
					return c.front
				}
				else if (c.back.dueDate.isDue()) {
					return c.back
				}
				else {
					throw new Error("no sides of the card are due")
				}
			}

			c.otherSide = () => {
				switch c.practiceSide() {
					case c.front {
						return c.back
					}
					case c.back {
						return c.front
					}
				}
			}

			c.markEasy = () => {
				c.practiceSide().score += 1

				c.practiceSide().dueDate = LocalDate.now()
					.plusDays(c.practiceSide().score)
					.toString()
			}

			c.markHard = () => {
				c.practiceSide().score -= 1 
				c.practiceSide().dueDate = LocalDate.now().toString()
			}
		},
	})

	return new class {

		async random(callback) { // no-null-check
			return await db.random(callback)
		}

		async save({frontSound, backSound} = {}, callback) { // no-null-check
			return await db.save({
				front: {
					sound: Assert.blob(frontSound),
					dueDate: LocalDate.now().toString(),
					score: 0,
				},
				back: {
					sound: Assert.blob(backSound),
					dueDate: LocalDate.now().toString(),
					score: 0,
				},
			}, callback)
		}

		async update(card, callback) { // no-null-check
			return await db.update(card, callback)
		}

		async delete(card, callback) { // no-null-check
			return await db.delete(card._dbKey, callback)
		}

		async all(callback) { // no-null-check
			return await db.all(callback)
		}

		async cardToPractice(callback) {
			return (await db.all(callback))
				.filter(c => c.front.dueDate.isDue() || c.back.dueDate.isDue())
				.find(c => c.random())
		}

		async resetDueDates(callback) {
			for (const c of await db.all(callback)) {
				c.front.dueDate = LocalDate.now().toString()
				c.back.dueDate = LocalDate.now().toString()
				await db.update(c)
			}
		}

	}
}
