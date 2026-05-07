export class LocalDate {
	constructor(arg) {

		if (A.string(arg)) {
			const match = arg.match(/^(\d{4})-(\d{2})-(\d{2})$/)
			if (match) {
				const [_,
					year,
					month,
					day] = match
				this.date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
			}
			else {
				throw new Error("Invalid date format. Expected yyyy-mm-dd")
			}
		}
		else if (arg instanceof Date) {
			this.date = new Date(Date.UTC(
				arg.getUTCFullYear(),
				arg.getUTCMonth(),
				arg.getUTCDate()
			))
		}
		else if (arg instanceof LocalDate) {
			this.date = new Date(arg.date)
		}
		else {
			throw new Error("LocalDate expects a string 'yyyy-mm-dd', a Date object, or another LocalDate")
		}
	}

	get year() {
		return this.date.getUTCFullYear()
	}

	get month() {
		return this.date.getUTCMonth() + 1
	}

	get day() {
		return this.date.getUTCDate()
	}

	plusDays(days) {
		const d = new Date(this.date)
		d.setUTCDate(d.getUTCDate() + days)
		return new LocalDate(d)
	}

	minusDays(days) {
		return this.plusDays(-days)
	}

	toString() {
		const y = this.year
		const m = String(this.month).padStart(2, "0")
		const d = String(this.day).padStart(2, "0")
		return `${y}-${m}-${d}`
	}

	toDate() {
		return new Date(this.date)
	}

	isDue() {
		const d = LocalDate.now()
		return this.toDate() <= d.toDate()
	}

	static now() {
		const today = new Date()
		const y = today.getUTCFullYear()
		const m = today.getUTCMonth() + 1
		const d = today.getUTCDate()
		return new LocalDate(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
	}

}
