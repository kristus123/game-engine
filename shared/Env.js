export class Env {
	static _env = ENV_REPLACED_BY_TRANSPILER

	static get prod() {
		return this._env == "PRODUCTION"
	}

	static get dev() {
		return this._env == "DEVELOPMENT"
	}
}
