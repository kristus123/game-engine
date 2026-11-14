export function IsTranslationEcho(caption, language) { // allow-null
	if !caption || caption.sourceLanguage != language {
		return false
	}
	// Never discard audio on a stale guess. Suppression requires matching text
	// and overlapping source/output alignment, not merely a detected script.
	if caption.sourceEnd == null || caption.outputStart == null || caption.sourceEnd < caption.outputStart {
		return false
	}
	const normalize = text => text.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "")
	const source = normalize(caption.source)
	return source.length > 0 && source == normalize(caption.translation)
}
