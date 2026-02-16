import Files from '#root/dev/build_tools/Files.js'
import { FileConfig } from '#root/FileConfig.js'

export default [...Files.at(FileConfig.engine), ...Files.at(FileConfig.game)]
	.filter(f => f.endsWith('.js'))
	.map(f => f.replaceAll('\\', '/'))
