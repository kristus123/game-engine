const Files = require('./Files')

module.exports = [...Files.at("engine"), ...Files.at("game")]
	.filter(f => f.endsWith('.js'))
	.map(f => f.replaceAll('\\', '/'))
