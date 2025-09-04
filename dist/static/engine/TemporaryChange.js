import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class TemporaryChange {
	constructor(object, fieldsToChange) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(fieldsToChange, "argument fieldsToChange in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 
		this.fieldsToChange = fieldsToChange; 

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

