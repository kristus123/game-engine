export default {
	extends: "stylelint-config-standard",
	plugins: ["@stylistic/stylelint-plugin"],
	rules: {
		"@stylistic/indentation": "tab",
		"@stylistic/string-quotes": "double",
		"keyframes-name-pattern": null,
		"selector-class-pattern": null,
		"block-no-empty": null,
		"declaration-block-no-redundant-longhand-properties": null,
		"shorthand-property-no-redundant-values": null,
		"value-list-max-empty-lines": null,
		"declaration-empty-line-before": null,
	},
}

