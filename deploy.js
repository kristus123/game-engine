import { startCluster } from './ccc.js'
import { checkAndPull } from './git.js'

const services = [
	{ name: 'socket', script: 'server/socket/SocketServer.js' },
	{ name: 'http', script: 'server/http/main.js' },
]

startCluster(services, (triggerReload) => {
	setInterval(() => {
		checkAndPull(triggerReload)
	}, 60 * 1000)
})
