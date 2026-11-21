export const Not = ProxyObject({
	onGetMissing: method => (...args) => !A[method](...args),
})
