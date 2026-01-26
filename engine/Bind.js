export function Bind(baseClass) {
	class Bound extends baseClass {
    	constructor(...args) {
        	super(...args)
        	let p = this
        	while (p && p !== Object.prototype) {
            	for (const k of Object.getOwnPropertyNames(p)) {
                	if (k === 'constructor') {
						continue
					}
                	const v = this[k]
                	if (typeof v === 'function') {
						this[k] = v.bind(this)
					}
            	}
            	p = Object.getPrototypeOf(p)
        	}
    	}
	}

	for (const k of Object.getOwnPropertyNames(Bound)) {
    	if (k === 'length' || k === 'name' || k === 'prototype') {
			continue
		}
    	const v = Bound[k]
    	if (typeof v === 'function') {
			Bound[k] = v.bind(Bound)
		}
	}

	return Bound
}
