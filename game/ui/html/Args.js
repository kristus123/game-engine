export class Args {
	static list(...args) {
		const lists = args.filter(Array.isArray)
		if (lists.length !== 1) {
  	throw new Error('Exactly one list is required')
		}
		return lists[0]
	}

	static string(...args) {
		const strings = args.filter(arg => typeof arg === 'string')
		if (strings.length !== 1) {
  	//throw new Error("Exactly one string is required");
  	return null
		}
		return strings[0]
	}

	static number(...args) {
		const numbers = args.filter(
  	arg => typeof arg === 'number' && !Number.isNaN(arg)
		)
		if (numbers.length !== 1) {
  	throw new Error('Exactly one number is required')
		}
		return numbers[0]
	}

	// max that enforces EXACT number of args
	static max(expectedCount, ...numbers) {
		if (typeof expectedCount !== 'number' || expectedCount <= 0) {
  	throw new Error('First argument must be a positive number')
		}

		if (numbers.length !== expectedCount) {
  	throw new Error(
    	`Expected exactly ${expectedCount} numbers, got ${numbers.length}`
  	)
		}

		if (!numbers.every(n => typeof n === 'number' && !Number.isNaN(n))) {
  	throw new Error('All arguments to max must be numbers')
		}

		return Math.max(...numbers)
	}
}
