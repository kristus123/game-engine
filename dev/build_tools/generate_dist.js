import Files from './Files.js'
import path from 'path'
import { FileConfig } from '#root/FileConfig.js'
import './transpiler.js'

Files.copyFolder(FileConfig.gameAssets, path.join(FileConfig.dist, FileConfig.gameAssets))
Files.copyFolder(FileConfig.gameAudio, path.join(FileConfig.dist, FileConfig.gameAudio))

import './copy_manifest_to_dist.js'
import './verify_no_reserved_clashes.js'
import './assert_unique_file_names.js'

const allAsepritePaths = Files.at(FileConfig.asepriteAssets)
	// .map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace(FileConfig.engineIndex, 'ASEPRITE_FILES', `[${allAsepritePaths}]`)

const audioFiles = Files.at(FileConfig.gameAudio)
	.filter(f => f.toLowerCase().endsWith('.mp3'))
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace(FileConfig.engineIndex, 'AUDIO_FILES', `[${audioFiles}]`)

const cssImports = Files.at(FileConfig.gameUiCss)
	.map(f => f.replaceAll('\\', '/')) // windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read(FileConfig.gameIndexHtml)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)
