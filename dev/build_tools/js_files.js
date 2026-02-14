import Files from './Files.js'
<<<<<<< HEAD
import { FileConfig } from '#root/FileConfig.js'

export default [...Files.at(FileConfig.engine), ...Files.at(FileConfig.game)]
=======
import paths from '../../config.js'

export default [...Files.at(paths.engine), ...Files.at(paths.game)]
>>>>>>> 47758959 (resolve 2)
	.filter(f => f.endsWith('.js'))
	.map(f => f.replaceAll('\\', '/'))
