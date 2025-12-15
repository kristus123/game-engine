//require('./rtc_video_call')
const socket_server = require('./SocketServer')
const LobbyServer = require('./LobbyServer')

const lobby_server = new LobbyServer(socket_server)
