export function filter(type = "lowpass", freq = 1200) {
	return Vst.filter(type, freq)
}
