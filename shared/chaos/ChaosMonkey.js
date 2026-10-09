export class ChaosMonkey {

	static validFeatures = Object.freeze([
		"RETRY",
		"NETWORK_FETCH",
		"NETWORK_STATUS",
		"SOCKET",
		"VIEWER_PAGE",
		"VIEWER_HLS",
	])

	static enabledFeatures = new Set()

	static validateFeature({ feature } = {}) {
		if (!this.validFeatures.includes(feature)) {
			throw new Error(`Unknown ChaosMonkey feature: ${feature}. Valid features: ${this.validFeatures.join(", ")}`)
		}

		return feature
	}

	static enable({ feature } = {}) {
		this.enabledFeatures.add(this.validateFeature({ feature }))
		return true
	}

	static disable({ feature } = {}) {
		if (feature == null) {
			this.enabledFeatures.clear()
			return true
		}

		return this.enabledFeatures.delete(this.validateFeature({ feature }))
	}

	static isEnabled({ feature } = {}) {
		return this.enabledFeatures.has(this.validateFeature({ feature }))
	}

	static async delay({ feature, minMs = 10, maxMs = 100 } = {}) {
		if (!this.isEnabled({ feature })) {
			return false
		}

		const ms = minMs + Math.random() * (maxMs - minMs)
		await new Promise(resolve => setTimeout(resolve, ms))
		return ms
	}

	static maybeCrash({ feature, message = "CRASH UH OH", chance = 0.1 } = {}) {
		if (!this.maybe({ feature, message, chance })) {
			return false
		}

		throw new Error(`CHAOS MONKEY (${feature}): ${message}`)
	}

	static maybe({ feature, message = "triggered", chance = 0.1 } = {}) {
		if (!this.isEnabled({ feature }) || Math.random() >= chance) {
			return false
		}

		console.warn(`ChaosMonkey triggered (${feature}): ${message}`)
		return true
	}

}
