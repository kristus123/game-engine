// rename to better name later

export class DuckCheck {
	constructor(name=[], spec=[]) {
		this.methods = spec.methods || []
		this.fields = spec.fields || []
	}

	assertValid(obj) {
		const errors = []

		const { methods, fields } = this.spec

		for (const m of methods.filter((m) => typeof obj[m] != "function")) {
			errors.push(`missing method: ${m}`)
		}

		for (const f of fields.filter((f) => !(f in obj))) {
			errors.push(`missing field: ${f}`)
		}

		if (errors.length) {
			throw new Error(`${this.name} duck check failed: ${errors.join(" | ")}`)
		}
		else {
			return obj
		}
	}
}
