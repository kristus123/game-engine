import { Secrets } from "#root/Secrets.js"
import tls from "tls"

const host = "mail1.netim.hosting"
const port = 465

const user = "kristian@happysun.no"
const pass = Secrets.emailPassword
console.log(pass)

const from = "kristian@happysun.no"
const to = "krispetter@gmail.com"

const message = [
	`From: ${from}`,
	`To: ${to}`,
	`Date: ${new Date().toUTCString()}`,
	`Message-ID: <${Date.now()}@happysun.no>`,
	"Subject: Test email",
	"MIME-Version: 1.0",
	"Content-Type: text/plain; charset=UTF-8",
	"",
	"Hello from Node.js without any libraries!"
].join("\r\n")

const socket = tls.connect(port, host, () => {
	send("EHLO localhost")
})

let step = 0

socket.on("data", data => {
	const response = data.toString()
	console.log(response.trim())

	if (response.startsWith("220")) {
		send("EHLO localhost")
	}

	else if (response.startsWith("250") && step == 0 && response.includes("AUTH")) {
		step = 1
		send("AUTH LOGIN")
	}

	else if (response.startsWith("334") && step == 1) {
		step = 2
		send(Buffer.from(user).toString("base64"))
	}

	else if (response.startsWith("334") && step == 2) {
		step = 3
		send(Buffer.from(pass).toString("base64"))
	}

	else if (response.startsWith("235")) {
		step = 4
		send(`MAIL FROM:<${from}>`)
	}

	else if (response.startsWith("250") && step == 4) {
		step = 5
		send(`RCPT TO:<${to}>`)
	}

	else if (response.startsWith("250") && step == 5) {
		step = 6
		send("DATA")
	}

	else if (response.startsWith("354")) {
		send(message + "\r\n.")
	}

	else if (response.startsWith("250") && step == 6) {
		send("QUIT")
	}

	else if (response.startsWith("221")) {
		socket.end()
	}
})

function send(text) {
	console.log(">", text)
	socket.write(text + "\r\n")
}
