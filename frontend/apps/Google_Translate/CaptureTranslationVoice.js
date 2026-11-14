export function CaptureTranslationVoice(context, stream, onClip, onError, onAudioBlocked) {
	const sink = new Audio()
	sink.muted = true
	sink.srcObject = stream
	const resume = () => sink.play().catch(onAudioBlocked)
	resume()
	const source = context.createMediaStreamSource(stream)
	const analyser = context.createAnalyser()
	analyser.fftSize = 1024
	const samples = new Float32Array(1024)
	const delay = context.createDelay(1)
	delay.delayTime.value = 0.2
	const destination = context.createMediaStreamDestination()
	source.connect(analyser)
	source.connect(delay)
	delay.connect(destination)
	const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"].find(type => MediaRecorder.isTypeSupported(type))
	let recorder = null
	let pendingRecordings = 0
	let started = 0
	let lastSound = 0
	let stopped = false
	let muted = false
	const record = now => {
		const recording = new MediaRecorder(destination.stream, mimeType ? { mimeType, audioBitsPerSecond: 64_000 } : {})
		const chunks = []
		started = now
		recorder = recording
		pendingRecordings++
		recording.ondataavailable = event => {
			if event.data.size > 0 {
				chunks.push(event.data)
			}
		}
		recording.onerror = () => {
			if !stopped {
				onError("Could not buffer translated speech. Please start again.")
			}
		}
		recording.onstop = () => {
			pendingRecordings--
			if !stopped && !muted && !recording.discard && chunks.length > 0 {
				onClip(new Blob(chunks, { type: recording.mimeType }))
			}
		}
		recording.start()
	}
	return {
		get pendingAudio() {
			return pendingRecordings > 0
		},
		resume,
		poll: now => {
			if stopped || muted {
				return
			}
			analyser.getFloatTimeDomainData(samples)
			const level = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length)
			const audible = level > 0.0006
			if audible {
				lastSound = now
				if !recorder {
					record(now)
				}
			}
			// The native delay preserves the opening syllable while polling starts
			// the recorder. Each short recording is a complete, playable media file.
			if recorder && (now - lastSound > 400 || now - started >= 2_000) {
				const previous = recorder
				recorder = null
				previous.stop()
				if audible {
					record(now)
				}
			}
		},
		setMuted: value => {
			muted = value
			if muted && recorder {
				const previous = recorder
				previous.discard = true
				recorder = null
				previous.stop()
			}
		},
		stop: () => {
			stopped = true
			if recorder?.state == "recording" {
				recorder.stop()
			}
			sink.pause()
			sink.srcObject = null
			source.disconnect()
			analyser.disconnect()
			delay.disconnect()
			destination.disconnect()
			destination.stream.getTracks().forEach(track => track.stop())
		},
	}
}
