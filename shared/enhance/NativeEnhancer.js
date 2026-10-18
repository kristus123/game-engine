export class NativeEnhancer {

	constructor(prototype) {
		Assert.value(prototype)

		const enhancerPrototype = new.target.prototype
		const allowedOverrides = new.target.allowInheritedOverride ?? []
		const excludedMembers = new.target.excludedMembers ?? []

		for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(enhancerPrototype))) {
			if (name == "constructor") {
				continue
			}
			if (excludedMembers.includes(name)) {
				continue
			}

			if (Object.hasOwn(prototype, name)) {
				throw new Error(`ENHANCE ERROR: "${prototype.constructor?.name ?? "anonymous"}" already has field "${name}". cannot be overridden`)
			}

			if (name in prototype && !allowedOverrides.includes(name)) {
				throw new Error(`ENHANCE ERROR: "${name}" is inherited by this prototype. add it to static allowInheritedOverride to shadow it`)
			}

			Object.defineProperty(prototype, name, {
				...descriptor,
				enumerable: false,
			})
		}
	}
}
