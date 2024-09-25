/**
 * Waits for a condition to be true, checking at regular intervals.
 * @param condition A function that returns a boolean or a Promise<boolean>.
 * @param options.interval The interval between checks in milliseconds.
 * @param options.timeout The maximum time to wait in milliseconds.
 * @returns A Promise that resolves when the condition is true, or rejects on timeout.
 */
export function waitFor(
	condition: () => boolean | Promise<boolean>,
	options: { interval: number; timeout: number }
): Promise<void> {
	const { interval, timeout } = options
	if (interval === undefined || timeout === undefined) {
		throw new Error("Both interval and timeout must be provided")
	}
	return new Promise((resolve, reject) => {
		const startTime = Date.now()
		const check = async () => {
			if (await condition()) {
				resolve()
			} else if (Date.now() - startTime >= timeout) {
				reject(new Error("Timeout waiting for condition"))
			} else {
				setTimeout(check, interval)
			}
		}
		check()
	})
}
