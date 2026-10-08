const delayMs = 50

export async function Retry(attempts, callback) {

	for (let i = 0; i < attempts; i++) {
		try {
			ChaosMonkey.maybeCrash("uh oh, retry failed")
			return await callback(i)
		}
		catch (e) {
			console.error(e)

			if (i == attempts - 1) {
				throw e
			}

			if (delayMs > 0) {
				await new Promise(resolve => setTimeout(resolve, delayMs))
			}
		}
	}
}
