import Files from './Files.js'
import paths from '#root/fileConfig.js'

export default [...Files.at(paths.engine), ...Files.at(paths.game)]
	.filter(f => f.endsWith('.js'))
	.map(f => f.replaceAll('\\', '/'))
