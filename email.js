import { Secrets } from "#root/Secrets.js"
import tls from "tls"

const host = "mail1.netim.hosting"
const port = 465

const user = "kristian@happysun.no"
const pass = Secrets.emailPassword

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

const socket = tls.connect({ host, port, servername: host })

let buffer = ""
let responseLines = []
let step = "greeting"

socket.setEncoding("utf8")

socket.on("data", data => {
	buffer += data

	while (buffer.includes("\r\n")) {
		const lineEnd = buffer.indexOf("\r\n")
		const line = buffer.slice(0, lineEnd)
		buffer = buffer.slice(lineEnd + 2)
		responseLines.push(line)

		if (/^\d{3} /.test(line)) {
			try {
				handleResponse(responseLines)
			}
			catch (error) {
				console.error("SMTP protocol error:", error.message)
				socket.end()
				process.exitCode = 1
			}
			responseLines = []
		}
	}
})

socket.on("error", error => {
	console.error("SMTP connection failed:", error.message)
	process.exitCode = 1
})

function handleResponse(lines) {
	const response = lines.join("\n")
	const code = Number(lines.at(-1).slice(0, 3))
	console.log(response)

	if (code >= 400) {
		console.error(`SMTP failed during ${step}`)
		socket.end()
		process.exitCode = 1
		return
	}

	switch (step) {
		case "greeting":
			expect(code, 220)
			step = "ehlo"
			send("EHLO localhost")
			break
		case "ehlo":
			expect(code, 250)
			if (!lines.some(line => /AUTH(?:=|\s).*LOGIN/i.test(line))) {
				throw new Error("SMTP server does not advertise AUTH LOGIN")
			}
			step = "auth-user"
			send("AUTH LOGIN")
			break
		case "auth-user":
			expect(code, 334)
			step = "auth-pass"
			send(Buffer.from(user).toString("base64"), true)
			break
		case "auth-pass":
			expect(code, 334)
			step = "mail-from"
			send(Buffer.from(pass).toString("base64"), true)
			break
		case "mail-from":
			expect(code, 235)
			step = "rcpt-to"
			send(`MAIL FROM:<${from}>`)
			break
		case "rcpt-to":
			expect(code, 250)
			step = "data"
			send(`RCPT TO:<${to}>`)
			break
		case "data":
			expect(code, 250)
			step = "message"
			send("DATA")
			break
		case "message":
			expect(code, 354)
			step = "quit"
			send(dotStuff(message) + "\r\n.")
			break
		case "quit":
			expect(code, 250)
			step = "done"
			send("QUIT")
			break
		case "done":
			expect(code, 221)
			socket.end()
			console.log("Email sent successfully")
			break
	}
}

function expect(actual, expected) {
	if (actual != expected) {
		throw new Error(`Expected SMTP ${expected} during ${step}, received ${actual}`)
	}
}

function dotStuff(text) {
	return text.replace(/(^|\r\n)\./g, "$1..")
}

function send(text, secret = false) {
	console.log(">", secret ? "[credentials hidden]" : text)
	socket.write(text + "\r\n")
}
