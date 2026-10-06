export class PropertyTestRandom {
	static create(seed, label) {
		let state = seed >>> 0
		for (const character of label) {
			state = Math.imul(state ^ character.charCodeAt(0), 16777619)
		}

		function next() {
			state += 0x6D2B79F5
			let value = state
			value = Math.imul(value ^ value >>> 15, value | 1)
			value ^= value + Math.imul(value ^ value >>> 7, value | 61)
			return ((value ^ value >>> 14) >>> 0) / 4294967296
		}

		function any(depth = 0) {
			const types = depth >= 2
				? ["undefined", "null", "boolean", "number", "string", "bigint", "symbol"]
				: ["undefined", "null", "boolean", "number", "string", "array", "object", "bigint", "symbol"]

			switch (types[Math.floor(next() * types.length)]) {
				case "undefined": return undefined
				case "null": return null
				case "boolean": return next() < 0.5
				case "number": return [NaN, Infinity, -Infinity, -0, Math.floor(next() * 2001) - 1000, next() * 2000 - 1000][Math.floor(next() * 6)]
				case "string": {
					const length = Math.floor(next() * 17)
					let value = ""
					for (let index = 0; index < length; index++) {
						value += String.fromCharCode(32 + Math.floor(next() * 95))
					}
					return value
				}
				case "array":
					return Array.from({ length: Math.floor(next() * 4) }, () => any(depth + 1))
				case "object": {
					const value = {}
					const length = Math.floor(next() * 4)
					for (let index = 0; index < length; index++) {
						value[`field${index}`] = any(depth + 1)
					}
					return value
				}
				case "bigint": return BigInt(Math.floor(next() * 2001) - 1000)
				case "symbol": return Symbol("property-test")
			}
		}

		return { any, next }
	}
}
