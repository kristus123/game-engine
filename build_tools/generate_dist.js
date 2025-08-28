const Files = require('./Files')

require('./transpiler')
require('./copy_asset_folder_to_dist')
require('./generate_helper_classes')


const allAsepritePaths = Files.at('static/assets/aseprite')
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/static/engine/start/index.js', 'ASEPRITE_FILES', `[${allAsepritePaths}]`)


const audioFiles = Files.at('static/audio')
	.filter(f => f.toLowerCase().endsWith(".mp3"))
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // windows compability
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/static/engine/start/index.js', 'AUDIO_FILES', `[${audioFiles}]`)



const jsImports = require('./js_files')
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')

const cssImports = Files.at('static/ui/css')
	.map(f => f.replaceAll('\\', '/')) // windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read('static/index.html')
	.replace('SCRIPT_IMPORTS', jsImports)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)
