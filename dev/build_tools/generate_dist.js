import Files from './Files.js'
import path from 'path'
import paths from '#root/fileConfig.js'
import './transpiler.js'

Files.copyFolder(paths.gameAssets, path.join(paths.dist, 'game/assets'))
Files.copyFolder(paths.gameAudio, path.join(paths.dist, 'game/audio'))

import './copy_manifest_to_dist.js'
import './verify_no_reserved_clashes.js'
import './assert_unique_file_names.js'

const allAsepritePaths = Files.at(paths.asepriteAssets)
	// .map(f => f.replace('/aseprite', ''))
	.map(f => f.replace(paths.game, 'game'))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/engine/start/index.js', 'ASEPRITE_FILES', `[${allAsepritePaths}]`)

const audioFiles = Files.at(paths.gameAudio)
	.filter(f => f.toLowerCase().endsWith('.mp3'))
	.map(f => f.replace(paths.game, 'game'))
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/engine/start/index.js', 'AUDIO_FILES', `[${audioFiles}]`)

const cssImports = Files.at(paths.gameUiCss)
	.map(f => f.replaceAll('\\', '/')) // windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read(paths.gameIndexHtml)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)
