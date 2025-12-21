const Files = require('./Files')

require('./transpiler')
require('./copy_asset_folder_to_dist')
require('./copy_manifest_to_dist')
require('./generate_helper_classes')
require('./verify_no_reserved_clashes')
require('./assert_unique_file_names')


const allAsepritePaths = Files.at('client/game/assets/aseprite')
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/engine/start/index.js', 'ASEPRITE_FILES', `[${allAsepritePaths}]`)


const audioFiles = Files.at('client/game/audio')
	.filter(f => f.toLowerCase().endsWith('.mp3'))
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/engine/start/index.js', 'AUDIO_FILES', `[${audioFiles}]`)



const jsImports = require('./js_files')
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')

const cssImports = Files.at('client/game/ui/css')
	.map(f => f.replaceAll('\\', '/')) // windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read('client/game/index.html')
	.replace('SCRIPT_IMPORTS', jsImports)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)


