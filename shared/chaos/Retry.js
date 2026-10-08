const delayMs = 100

export async function Retry(attempts, callback) {
	for (let i = 0; i < attempts; i++) {
		try {
			return await callback()
		}
		catch (e) {
			if (i == attempts - 1) {
				throw e
			}

			if (delayMs > 0) {
				await new Promise(resolve => setTimeout(resolve, delayMs))
			}
		}
	}
}
