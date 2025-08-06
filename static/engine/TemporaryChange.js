export class TemporaryChange {
	constructor(object, fieldsToChange) {
		this.oldValues = {}

		for (const fieldName in fieldsToChange) {
			if (fieldsToChange.hasOwnProperty(fieldName)) {
				this.oldValues[fieldName] = object[fieldName]
			}
		}
	}

	applyIf(condition, run) {
		if (condition) {
			for (const fieldName in this.fieldsToChange) {
				if (this.fieldsToChange.hasOwnProperty(fieldName)) {
					const temporaryValue = this.fieldsToChange[fieldName]
					this.object[fieldName] = temporaryValue
				}
			}

			run()
		}

		if (!condition) {
			for (const fieldName in this.fieldsToChange) {
				if (this.fieldsToChange.hasOwnProperty(fieldName)) {
					this.object[fieldName] = this.oldValues[fieldName]
				}
			}
		}
	}
}

