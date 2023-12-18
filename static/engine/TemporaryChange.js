export class TemporaryChange {
	constructor(fieldsToChange) {
		this.fieldsToChange = fieldsToChange
		this.oldValues = {}

		for (const field of fieldsToChange) {
			const object = field[0]
			const fieldName = field[1]

			this.oldValues[fieldName] = object[fieldName]
		}
	}

	applyIf(condition, run) {
		if (condition) {
			for (const field of this.fieldsToChange) {
				const object = field[0]
				const fieldName = field[1]
				const temporaryValue = field[2]

				object[fieldName] = temporaryValue
			}

			run()
		}

		if (!condition) {
			for (const field of this.fieldsToChange) {
				const object = field[0]
				const fieldName = field[1]
				
				object[fieldName] = this.oldValues[fieldName]
			}
		}
	}
}


