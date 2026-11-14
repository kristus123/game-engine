export function UpdateRealtimeCaption(state, event, createId, languages, targetLanguage) {
	const input = event.type == "session.input_transcript.delta"
	if !input && event.type != "session.output_transcript.delta" {
		return null
	}
	if typeof event.delta != "string" || !event.delta {
		return null
	}
	const { segments, latestInput } = state
	const time = Number.isFinite(event.elapsed_ms) ? event.elapsed_ms : null
	const detected = input ? DetectConversationLanguage(event.delta, languages) : null
	const ordered = !latestInput || time == null || latestInput.time == null || time >= latestInput.time
	const changedLanguage = input && ordered && detected && latestInput?.language && detected != latestInput.language
	const sources = segments.filter(part => part.source)
	let segment = null
	if input && ordered && latestInput && !changedLanguage {
		// Translation output can extend far past its source. Only source timing
		// may keep the next source fragment in the same speaker's turn.
		if time == null || latestInput.time == null || !detected || time - latestInput.time <= 1_500 {
			segment = latestInput.segment
		}
	}
	if !segment && !changedLanguage {
		// Select by source boundaries, never by an interval expanded by output.
		for const candidate of sources {
			if time == null || candidate.sourceStart == null || candidate.sourceStart <= time {
				if !segment || (candidate.sourceStart ?? -Infinity) >= (segment.sourceStart ?? -Infinity) {
					segment = candidate
				}
			}
		}
		if segment && input && detected && segment.sourceLanguage != detected {
			segment = null
		}
		const lastTime = input ? segment?.sourceEnd : Math.max(segment?.sourceEnd ?? -Infinity, segment?.outputEnd ?? -Infinity)
		if segment && time != null && lastTime != null && time - lastTime > 1_500 {
			segment = null
		}
	}
	if !segment {
		let distance = Infinity
		for const candidate of segments {
			if candidate.source {
				continue
			}
			const gap = time == null || candidate.start == null ? 0 : Math.max(candidate.start - time, time - candidate.end, 0)
			if gap <= 1_500 && gap < distance {
				segment = candidate
				distance = gap
			}
		}
	}
	if !segment {
		segment = { id: createId(), source: "", translation: "", sourceLanguage: null, start: time, end: time, sourceStart: null, sourceEnd: null, outputStart: null, outputEnd: null, outputs: [] }
		segments.push(segment)
	}
	if input {
		segment.source += event.delta
		segment.sourceLanguage = detected || segment.sourceLanguage || (ordered ? latestInput?.language : null) || null
		if time != null && event.delta.trim() {
			segment.sourceStart = Math.min(segment.sourceStart ?? time, time)
			segment.sourceEnd = Math.max(segment.sourceEnd ?? time, time)
		}
		if ordered && event.delta.trim() {
			state.latestInput = { segment, language: segment.sourceLanguage, time }
		}
		// Late source captions can split provisional output. Move only output
		// inside this source turn, and let callers refresh both affected rows.
		if time != null {
			const nextStart = Math.min(...segments.filter(part => part != segment && part.sourceStart != null && part.sourceStart > segment.sourceStart).map(part => part.sourceStart))
			for const previous of segments {
				if previous == segment {
					continue
				}
				let leadIndex = Infinity
				// Frame alignment can put the opening word just before the new
				// source caption. Recognize a matching same-language sentence prefix.
				if segment.sourceLanguage == targetLanguage {
					const normalize = text => text.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "")
					const prefix = normalize(segment.source)
					for let index = 0; index < previous.outputs.length; index++ {
						const part = previous.outputs[index]
						const word = normalize(part.delta)
						const sentenceStart = index == 0 || /[.!?。！？]\s*$/.test(previous.outputs[index - 1].delta)
						if sentenceStart && word && prefix && (prefix.startsWith(word) || word.startsWith(prefix)) && part.time != null && part.time >= segment.sourceStart - 600 && index < leadIndex {
							leadIndex = index
						}
					}
				}
				const moved = previous.outputs.filter((part, index) => part.time != null && (part.time >= segment.sourceStart || index >= leadIndex) && part.time < nextStart)
				if moved.length > 0 {
					previous.outputs = previous.outputs.filter(part => !moved.includes(part))
					segment.outputs.push(...moved)
					if !previous.source && previous.outputs.length == 0 {
						previous.reroutedTo = segment
					}
				}
			}
		}
	}
	else {
		segment.outputs.push({ delta: event.delta, time })
	}
	for const part of segments {
		// Stable sorting preserves append-only deltas sharing a frame timestamp.
		part.outputs.sort((a, b) => (a.time ?? 0) - (b.time ?? 0))
		part.translation = part.outputs.map(output => output.delta).join("")
		const times = part.outputs.map(output => output.time).filter(value => value != null)
		part.outputStart = times.length > 0 ? Math.min(...times) : null
		part.outputEnd = times.length > 0 ? Math.max(...times) : null
		const starts = [part.sourceStart, part.outputStart].filter(value => value != null)
		const ends = [part.sourceEnd, part.outputEnd].filter(value => value != null)
		part.start = starts.length > 0 ? Math.min(...starts) : null
		part.end = ends.length > 0 ? Math.max(...ends) : null
	}
	return segment
}
