import Files from './Files.js'

export default [...Files.at('engine'), ...Files.at('game')]
	.filter(f => f.endsWith('.js'))
	.map(f => f.replaceAll('\\', '/'))
