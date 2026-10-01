import { createRequire } from "module"
import { Files as FileSystem } from "#root/dev/Files.js"
import PathModule from "path"

const require = createRequire(import.meta.url)
const namesAndPaths = FileSystem.namesAndPaths("./")

export const AllImports = new Proxy({}, {
	get(_target, name) {
		if (typeof name != "string") {
			return undefined
		}

		const filePath = namesAndPaths.get(name)
		if (filePath == null) {
			throw new Error(`File ${name}.js not found in project`)
		}

		const moduleExports = require(PathModule.resolve(filePath))
		if (!(name in moduleExports)) {
			throw new Error(`Named export "${name}" not found in ${filePath}`)
		}

		return moduleExports[name]
	}
})

export function LazyImport(name) {
	let proxy

	const target = function() {}

	proxy = new Proxy(target, {
		get(_target, property) {
			const moduleExport = AllImports[name]
			if (moduleExport == null || (typeof moduleExport != "object" && typeof moduleExport != "function")) {
				throw new Error(`Named export "${name}" is not an object or function while reading "${String(property)}"`)
			}
			const value = Reflect.get(moduleExport, property, moduleExport)
			return typeof value == "function" ? value.bind(moduleExport) : value
		},
		set(_target, property, value) {
			return Reflect.set(AllImports[name], property, value, AllImports[name])
		},
		apply(_target, thisArgument, argumentsList) {
			const value = AllImports[name]
			return Reflect.apply(value, thisArgument ?? value, argumentsList)
		},
		construct(_target, argumentsList, newTarget) {
			const value = AllImports[name]
			return Reflect.construct(value, argumentsList, newTarget == proxy ? value : newTarget)
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(AllImports[name])
		}
	})

	return proxy
}
