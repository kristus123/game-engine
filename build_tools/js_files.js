const Files = require('./Files')

module.exports = Files.at('static')
	.filter(f => f.endsWith('.js'))
	.map(f => f.replaceAll('\\', '/'))
	.sort()
