function _readMemberList(members, listName) {
	members = members === undefined ? [] : members
	if (!Array.isArray(members)) {
		throw new TypeError(`ENHANCE ERROR: ${listName} must be an array`)
	}

	const seen = new Set()
	for (const name of members) {
		if (typeof name != "string" && typeof name != "symbol") {
			throw new TypeError(`ENHANCE ERROR: ${listName} entries must be strings or symbols`)
		}
		if (seen.has(name)) {
			throw new Error(`ENHANCE ERROR: ${listName} contains duplicate member "${String(name)}"`)
		}
		seen.add(name)
	}

	return members
}

export class NativeEnhancer {

	constructor(prototype, options = {}) {
		if (prototype == null || (typeof prototype != "object" && typeof prototype != "function")) {
			throw new TypeError("ENHANCE ERROR: target must be a prototype object")
		}
		if (options == null || typeof options != "object" || Array.isArray(options)) {
			throw new TypeError("ENHANCE ERROR: options must be an object")
		}

		for (const key of Reflect.ownKeys(options)) {
			if (key != "allowOverride" && key != "excludedMembers") {
				throw new Error(`ENHANCE ERROR: unknown option "${String(key)}"`)
			}
		}

		const enhancerPrototype = new.target.prototype
		const descriptors = Object.getOwnPropertyDescriptors(enhancerPrototype)
		const memberNames = Reflect.ownKeys(descriptors).filter(name => name != "constructor")
		const allowedOverrides = _readMemberList(Object.hasOwn(options, "allowOverride") ? options.allowOverride : undefined, "allowOverride")
		const excludedMembers = _readMemberList(Object.hasOwn(options, "excludedMembers") ? options.excludedMembers : undefined, "excludedMembers")
		const memberNameSet = new Set(memberNames)
		const allowedOverrideSet = new Set(allowedOverrides)
		const excludedMemberSet = new Set(excludedMembers)

		for (const name of allowedOverrides) {
			if (!memberNameSet.has(name)) {
				throw new Error(`ENHANCE ERROR: allowOverride contains "${String(name)}", which is not a member of the enhancer`)
			}
			if (excludedMemberSet.has(name)) {
				throw new Error(`ENHANCE ERROR: "${String(name)}" cannot be both allowed and excluded`)
			}
			if (!Reflect.has(prototype, name)) {
				throw new Error(`ENHANCE ERROR: allowOverride contains "${String(name)}", but the target does not have that member`)
			}
		}

		for (const name of excludedMembers) {
			if (!memberNameSet.has(name)) {
				throw new Error(`ENHANCE ERROR: excludedMembers contains "${String(name)}", which is not a member of the enhancer`)
			}
		}

		const membersToInstall = []
		for (const name of memberNames) {
			if (excludedMemberSet.has(name)) {
				continue
			}

			const existingMember = Reflect.has(prototype, name)
			if (existingMember && !allowedOverrideSet.has(name)) {
				const ownership = Object.hasOwn(prototype, name) ? "already has own member" : "inherits member"
				throw new Error(`ENHANCE ERROR: target ${ownership} "${String(name)}". pass it in allowOverride to shadow it`)
			}

			const existingDescriptor = Object.getOwnPropertyDescriptor(prototype, name)
			if (existingDescriptor && !existingDescriptor.configurable) {
				throw new Error(`ENHANCE ERROR: target member "${String(name)}" is not configurable and cannot be overridden`)
			}
			if (!existingDescriptor && !Object.isExtensible(prototype)) {
				throw new Error(`ENHANCE ERROR: target prototype is not extensible; cannot install "${String(name)}"`)
			}

			membersToInstall.push([name, descriptors[name]])
		}

		for (const [name, descriptor] of membersToInstall) {
			Object.defineProperty(prototype, name, {
				...descriptor,
				enumerable: false,
			})
		}
	}
}
