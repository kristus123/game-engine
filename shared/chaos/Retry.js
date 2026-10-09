export async function Retry(attempts, callback, {
	feature = "RETRY",
	message = "uh oh, retry failed",
	delayMs = 50,
	maxDelayMs = 50,
} = {}) {
	ChaosMonkey.validateFeature({ feature })

	for (let i = 0; i < attempts; i++) {
		try {
			ChaosMonkey.maybeCrash({
				feature: feature,
				message: message,
			})
			return await callback(i)
		}
		catch (e) {
			if (i == attempts - 1) {
				console.error(`Retry failed after ${attempts} attempts`, e)
				throw e
			}
			console.warn(`Retry attempt ${i + 1}/${attempts} failed`, e)

			if (delayMs > 0) {
				const retryDelayMs = Math.min(delayMs * 2 ** i, maxDelayMs)
				await new Promise(resolve => setTimeout(resolve, retryDelayMs))
			}
		}
	}
}
