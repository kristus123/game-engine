const Server = require('./SocketServer')

const server = new SocketServer(8082)

server.start()
