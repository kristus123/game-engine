import { Secrets } from "#root/Secrets.js"
import { createHash } from "node:crypto"

const pendingTranslationSessions = new Set()

UnsecureRoute.realtimeTranslationSession = async ({ userId }) => {
	if pendingTranslationSessions.has(userId) || pendingTranslationSessions.size >= 4 {
		throw new Error("Translation is busy. Please try again.")
	}
	pendingTranslationSessions.add(userId)
	try {
		const response = await fetch("https://api.openai.com/v1/realtime/translations/client_secrets", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${Secrets.openAiToken}`,
				"Content-Type": "application/json",
				"OpenAI-Safety-Identifier": createHash("sha256").update(userId).digest("hex"),
			},
			body: JSON.stringify({
				expires_after: { anchor: "created_at", seconds: 600 },
				session: {
					model: "gpt-realtime-translate",
						audio: {
						input: { transcription: { model: "gpt-live-transcribe" }, noise_reduction: { type: "near_field" } },
						output: { language: "ja" },
					},
				},
			}),
			signal: AbortSignal.timeout(20_000),
		})
		if !response.ok {
			throw new Error(`Translation service could not start (${response.status})`)
		}
		const data = await response.json()
		if typeof data.value != "string" {
			throw new Error("Translation service returned no session credential")
		}
		return { value: data.value }
	}
	finally {
		pendingTranslationSessions.delete(userId)
	}
}
