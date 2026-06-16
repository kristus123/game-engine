const token = localStorage.getItem("openaiToken")

if (token == null) {
	const value = prompt("Enter a value to store:")
	localStorage.setItem("openaiToken", value)
}

export const OpenAiToken = token
