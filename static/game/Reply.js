export const Reply = (text, conversation) => {
	return {
		key: 'ok',
		keypress: 'a',
		text: text,
		conversation: conversation,
	}
}

