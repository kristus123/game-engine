import { Secrets } from "#root/Secrets.js"
import { createHash } from "node:crypto"

const pendingTranslations = new Set()

UnsecureRoute.translationSession = async ({ body, userId }) => {
	const language = body?.language
	if !["en", "zh", "ja"].includes(language) {
		throw new Error("Choose a supported translation language")
	}
	if pendingTranslations.has(userId) || pendingTranslations.size >= 4 {
		throw new Error("Translation is busy. Please try again.")
	}
	pendingTranslations.add(userId)
	try {
		const session = {
			model: "gpt-realtime-translate",
			audio: {
				input: { transcription: { model: "gpt-realtime-whisper" } },
				output: { language },
			},
		}
		const response = await fetch("https://api.openai.com/v1/realtime/translations/client_secrets", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${Secrets.openAiToken}`,
				"Content-Type": "application/json",
				"OpenAI-Safety-Identifier": createHash("sha256").update(userId).digest("hex"),
			},
			body: JSON.stringify({
				expires_after: { anchor: "created_at", seconds: 60 },
				session,
			}),
			signal: AbortSignal.timeout(20_000),
		})
		if !response.ok {
			throw new Error(`Translation service could not start (${response.status}). Check model access and the selected output language.`)
		}
		const data = await response.json()
		if typeof data.value != "string" {
			throw new Error("Translation service returned no session credential")
		}
		return { value: data.value, mode: "translation" }
	}
	finally {
		pendingTranslations.delete(userId)
	}
}
