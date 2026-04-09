export function ToggleButton(t1, t2) {
	let t = t1

	return H.button(t1.text, b => {
		if (t == t1) {
			t1.onClick(b, () => {
				t = t2
				b.text(t2.text)
			})
		}
		else if (t == t2) {

			t2.onClick(b, () => {
				t = t1
				b.text(t1.text)
			})
		}
	})
}
