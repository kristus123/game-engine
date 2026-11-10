// The root Secrets.js contains local credentials and is gitignored.
function productionSecretsError(operation) {
	throw new Error(`Secrets were ${operation} in production. Do not use Secrets in production; this is a bug.`)
}

const unavailableSecrets = new Proxy({}, {
	get: (_target, property) => productionSecretsError(`read at ${String(property)}`),
	set: (_target, property) => productionSecretsError(`written at ${String(property)}`),
	has: (_target, property) => productionSecretsError(`checked for ${String(property)}`),
	ownKeys: () => productionSecretsError("enumerated"),
	getOwnPropertyDescriptor: (_target, property) => productionSecretsError(`inspected at ${String(property)}`),
	defineProperty: (_target, property) => productionSecretsError(`defined at ${String(property)}`),
	deleteProperty: (_target, property) => productionSecretsError(`deleted at ${String(property)}`),
	getPrototypeOf: () => productionSecretsError("inspected"),
	setPrototypeOf: () => productionSecretsError("modified"),
	isExtensible: () => productionSecretsError("inspected"),
	preventExtensions: () => productionSecretsError("modified"),
})

export const Secrets = Env.dev
	? (await import("/Secrets.js")).Secrets
	: unavailableSecrets
