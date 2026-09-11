// I tried to remove this class but it is used in multiple files
// and it is wise to keep the schema in the same place so this card has an okay purpose

export async function CardDb() {

	const db = await Db("jap")

	return new class {

		async random(callback) { // no-null-check
			return db.random(callback)
		}

		async save(card, callback) { // no-null-check
			return db.save({
				front: Assert.value(card.front),
				back: Assert.value(card.back),
				score: 0,
				nextPracticeDate: LocalDate.now().toString(),
			}, callback)
		}

		async update(card, callback) { // no-null-check
			return db.update(card, callback)
		}

		async all(callback) { // no-null-check
			return db.all(callback)
		}

	}
}
