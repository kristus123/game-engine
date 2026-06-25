import http from "http"
import fs from "fs"
import mime from "mime-types"

import { FileConfig } from "#root/FileConfig.js"

const server = http.createServer((req, res) => {
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")

	let url = req.url === "/" ? "/index.html" : req.url

	if (url.includes("..")) {
		res.writeHead(403)
		return res.end()
	}

	if (url.endsWith("/")) url += "index.html"

	let filePath = FileConfig.dist + url

	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404)
			return res.end()
		}
		else {
			res.setHeader("Content-Type", mime.lookup(filePath) || "application/octet-stream")
			res.writeHead(200)
			res.end(data)
		}
	})
})



export function ServeDist() {
	server.listen(5050, "0.0.0.0")
}
