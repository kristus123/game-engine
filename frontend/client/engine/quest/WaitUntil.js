// maybe rename to something like 'continueIf'
export function WaitUntil(condition) {
	return {
		markDoneIf: () => condition()
	}
}
