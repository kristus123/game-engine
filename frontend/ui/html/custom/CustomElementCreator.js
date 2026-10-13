export function CustomElementCreator(initialize) {
	return class extends HTMLElement {
		_setupPromise = null
		_destroyed = false
		_lifecycleActive = false

		async connectedCallback() { // on dom enter
			if !this.isConnected || this._destroyed {
				return
			}

			await (this._setupPromise ??= initialize(this))
			if !this.isConnected || this._destroyed {
				return
			}

			this._lifecycleActive = true
		}

		async disconnectedCallback() { // on dom leave
			if this._destroyed {
				return
			}

			const wasActive = this._lifecycleActive
			this._lifecycleActive = false
			const options = await this._setupPromise ?? {}
			if wasActive {
				await options.onDisconnected?.()
			}
			if this.isConnected || this.neverDestroy || this._destroyed {
				return
			}

			this._destroyed = true
			await options.onDestroy?.()
			CustomElementHelper.removeFields(this)
			this.replaceChildren()
		}
	}
}
