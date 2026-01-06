import PushServer from './PushServer.js'

const pushServer = new PushServer(3001)
pushServer.start()

// Configure with VAPID keys
// Generate keys once: npx web-push generate-vapid-keys
// Then uncomment and add your keys below:

pushServer.pushService.configure({
	publicKey: 'BPmfBE9RuToE9GUVFgA1kR0UCHqFiw015uDXDql7NuYrWqyrzq80OdJUz1zndQIqbeuZIVGXXQ6dFbnRe7ftwl4',
	privateKey: '6CjkwpnbPylcUMZ4BXoPu6kq1povH5bSZNJu11LSWtQ',
	subject: 'mailto:ojogunemmy@gmail.com'
})

export default pushServer
