import { PropertyTestRandom } from "#root/shared/PropertyTestRandom.js"
import { TurnResultToStringValue } from "#root/shared/TurnResultToStringValue.js"

const SIDE_EFFECT_METHOD = /^(start|stop|listen|connect|disconnect|send|fetch|request|post|get|create|delete|remove|write|save|open|close|destroy|subscribe|unsubscribe|observe|record|play|pause|register|restart|shutdown|init|initiate|load|export|import|execute|kill|spawn|fork|run|addEventListener|removeEventListener)(?:$|[A-Z_])/i

export class PropertyTestBrowser {
	static collectMethods(module) {
		const methods = []

		function add(exportName, kind, methodName, fn) {
			methods.push({ exportName, kind, methodName, arity: fn.length })
		}

		for (const exportName of Object.keys(module).sort()) {
			const target = module[exportName]
			if (typeof target == "function" && /^class\s/.test(Function.prototype.toString.call(target))) {
				for (const methodName of Object.getOwnPropertyNames(target).sort()) {
					if (["length", "name", "prototype", "caller", "arguments"].includes(methodName)) {
						continue
					}
					const descriptor = Object.getOwnPropertyDescriptor(target, methodName)
					if (typeof descriptor?.value == "function") {
						add(exportName, "static", methodName, descriptor.value)
					}
				}

				for (const methodName of Object.getOwnPropertyNames(target.prototype || {}).sort()) {
					if (methodName == "constructor") {
						continue
					}
					const descriptor = Object.getOwnPropertyDescriptor(target.prototype, methodName)
					if (typeof descriptor?.value == "function") {
						add(exportName, "instance", methodName, descriptor.value)
					}
				}
			}
			else if (typeof target == "function") {
				add(exportName, "function", exportName, target)
			}
			else if (target !== null && typeof target == "object") {
				for (const methodName of Object.keys(target).sort()) {
					const descriptor = Object.getOwnPropertyDescriptor(target, methodName)
					if (typeof descriptor?.value == "function") {
						add(exportName, "object", methodName, descriptor.value)
					}
				}
			}
		}

		const nameCounts = new Map()
		for (const method of methods) {
			nameCounts.set(method.methodName, (nameCounts.get(method.methodName) || 0) + 1)
		}
		for (const method of methods) {
			method.folder = nameCounts.get(method.methodName) == 1
				? method.methodName
				: `${method.exportName}.${method.kind}.${method.methodName}`
		}

		return methods
	}

	static async run(config) {
		const module = await import(config.moduleUrl)
		const methods = this.collectMethods(module)
		const results = []

		for (const method of methods) {
			if (!config.includeSideEffects && SIDE_EFFECT_METHOD.test(method.methodName)) {
				results.push({ method, skipped: true })
				continue
			}

			const random = PropertyTestRandom.create(config.seed, `${config.source}:${method.exportName}:${method.kind}:${method.methodName}`)
			const target = module[method.exportName]
			const cases = []
			for (let run = 0; run < config.runs; run++) {
				const args = Array.from({ length: method.arity }, () => random.any())
				const argsString = TurnResultToStringValue(args)
				let fn
				let receiver
				if (method.kind == "static") {
					fn = target[method.methodName]
					receiver = target
				}
				else if (method.kind == "instance") {
					fn = target.prototype[method.methodName]
					receiver = Object.create(target.prototype)
				}
				else if (method.kind == "object") {
					fn = target[method.methodName]
					receiver = target
				}
				else {
					fn = target
					receiver = undefined
				}

				let result
				let didThrow = false
				const originalRandom = Math.random
				Math.random = random.next
				try {
					result = await fn.apply(receiver, args)
				}
				catch (error) {
					result = error
					didThrow = true
				}
				finally {
					Math.random = originalRandom
				}

				const output = `${didThrow ? "throw" : "return"} ${TurnResultToStringValue(result)}`

				cases.push({ args: argsString, output })
			}

			results.push({ method, cases })
		}

		return results
	}
}
