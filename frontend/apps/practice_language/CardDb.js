// I tried to remove this class but it is used in multiple files
// and it is wise to keep the schema in the same place so this card has an okay purpose

export async function CardDb() {

	const db = await Db("jap", {
		prototype: {
			practiceSide() {
				if (this.front.dueDate.isDue()) {
					return this.front
				}
				else if (this.back.dueDate.isDue()) {
					return this.back
				}
				else {
					throw new Error("no sides of the card are due")
				}
			},
			otherSide() {
				switch this.practiceSide() {
					case this.front {
						return this.back
					}
					case this.back {
						return this.front
					}
				}
			},
			markEasy() {
				this.practiceSide().score += 1

				this.practiceSide().dueDate = LocalDate.now()
					.plusDays(this.practiceSide().score)
					.toString()
			},
			markHard() {
				this.practiceSide().score -= 1 
				this.practiceSide().dueDate = LocalDate.now().toString()
			},
		}
	})

	return new class {

		async random() {
			return await db.random()
		}

		async save({frontSound, backSound} = {}) {
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
			})
		}

		async update(card) {
			return await db.update(card)
		}

		async delete(card) {
			return await db.delete(card._dbKey)
		}

		async all() {
			return await db.all()
		}

		async cardToPractice() {
			return (await db.all())
				.filter(c => c.front.dueDate.isDue() || c.back.dueDate.isDue())
				.find(c => c)
		}

		async resetAllDueDates() {
			for (const c of await db.all()) {
				c.front.dueDate = LocalDate.now().toString()
				c.back.dueDate = LocalDate.now().toString()
				await db.update(c)
			}
		}

	}
}
