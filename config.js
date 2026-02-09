import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const paths = {
	// Source directories
	game: 'client/game',
	engine: 'client/engine',
	buildTools: 'dev/build_tools',
	
	// Output directory
	dist: 'dist',
	
	// Specific paths
	get gameAssets() { return path.join(this.game, 'assets') },
	get gameAudio() { return path.join(this.game, 'audio') },
	get asepriteAssets() { return path.join(this.game, 'assets/aseprite') },
	get gameUiCss() { return path.join(this.game, 'ui/css') },
	get gameIndexHtml() { return path.join(this.game, 'index.html') },
	
	// Static output
	get distStatic() { return path.join(this.dist, 'static') },
	
	// Root directory
	root: __dirname
}

export default paths
