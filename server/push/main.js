import PushServer from './PushServer.js'

const pushServer = new PushServer(3001)
pushServer.start()

// Configure with VAPID keys
// Generate keys once: npx web-push generate-vapid-keys
pushServer.pushService.configure({
	publicKey: 'YOUR_VAPID_PUBLIC_KEY_HERE',
	privateKey: 'YOUR_VAPID_PRIVATE_KEY_HERE',
	subject: 'mailto:your-email@example.com'
})

export default pushServer
