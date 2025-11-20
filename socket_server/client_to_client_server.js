const clientToClientServer = require('./ClientToClient_SocketServer')

const server = new clientToClientServer(8082)

server.start()
