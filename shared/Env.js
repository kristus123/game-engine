export class Env {
	static _env = ENV_REPLACED_BY_TRANSPILER

	static get active() {
		return this._env
	}

	static get dev() {
		return this._env == "DEVELOPMENT"
	}

	static get prod() {
		return this._env == "PRODUCTION"
	}
}
