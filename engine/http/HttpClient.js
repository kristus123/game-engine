export const HttpClient = ProxyObject({}, (method, body = {}, callback = (body) => {}) => {
	fetch(`http://localhost:3000/api/${method}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	}).then(r => callback(r.json()))
})

