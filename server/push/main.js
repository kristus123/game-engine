import PushServer from './PushServer.js'

const pushServer = new PushServer(3001)
pushServer.start()

// Configure with VAPID keys
// Generate keys once: npx web-push generate-vapid-keys
pushServer.pushService.configure({
	publicKey: 'BNET4fzlrxnp4J8lKqZU0KW-3N6QgZqZdkT8ZVWsShZHs59QixF8c9rhOAF2to1izat8Hu2Gglv4kZqa_vWskXk',
	privateKey: 'r2XQE_TWOAY3w57lxbJIZDXSnIMe2B7wCcimv-CyLSE',
	subject: 'mailto:ojogunemmy@gmail.com'
})

export default pushServer
