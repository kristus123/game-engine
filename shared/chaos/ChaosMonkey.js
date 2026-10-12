export class ChaosMonkey {

	static features = {
		RETRY: { enabled: false },
		NETWORK_FETCH: { enabled: false },
		NETWORK_STATUS: { enabled: false },
		SOCKET: { enabled: false },
		VIEWER_PAGE: { enabled: false },
		VIEWER_HLS: { enabled: false },
	}

	static assertValidFeature(feature) {
		if (Object.hasOwn(this.features, feature)) {
			return feature
		}
		else {
			throw new Error(`Unknown ChaosMonkey feature: ${feature}. Valid features: ${Object.keys(this.features).join(", ")}`)
		}
	}

	static async delay({ feature, minMs = 10, maxMs = 100 } = {}) {
		this.assertValidFeature(feature)
		if (!this.features[feature].enabled) {
			return false
		}

		const ms = minMs + Math.random() * (maxMs - minMs)
		await new Promise(resolve => setTimeout(resolve, ms))

		return ms
	}

	static maybeCrash(feature, chance = 0.1) {
		if (!this.maybe(feature, chance)) {
			return false
		}

		throw new Error(`CHAOS MONKEY CRASH (${feature})`)
	}

	static maybe(feature, chance = 0.1) {
		this.assertValidFeature(feature)
		if (!this.features[feature].enabled || Math.random() >= chance) {
			return false
		}

		console.warn(`ChaosMonkey triggered (${feature})`)
		return true
	}

}
