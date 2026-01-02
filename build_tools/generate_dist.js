import Files from './Files.js'

import './transpiler.js'

Files.copyFolder('game/assets/', 'dist/game/assets/')
Files.copyFolder('game/audio/', 'dist/game/audio/')

import './copy_manifest_to_dist.js'
import './verify_no_reserved_clashes.js'
import './assert_unique_file_names.js'

const allAsepritePaths = Files.at('game/assets/aseprite')
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/engine/start/index.js', 'ASEPRITE_FILES', `[${allAsepritePaths}]`)


const audioFiles = Files.at('game/audio')
	.filter(f => f.toLowerCase().endsWith('.mp3'))
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/engine/start/index.js', 'AUDIO_FILES', `[${audioFiles}]`)



import jsImportsArray from './js_files.js'
const jsImports = jsImportsArray
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')

const cssImports = Files.at('game/ui/css')
	.map(f => f.replaceAll('\\', '/')) // windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read('game/index.html')
	.replace('SCRIPT_IMPORTS', jsImports)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)


