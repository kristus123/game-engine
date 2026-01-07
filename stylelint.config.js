export default {
	extends: 'stylelint-config-standard',
	rules: {
		'indentation': 4,
		'string-quotes': 'double',
		  'property-no-unknown': [true, {
  	ignoreProperties: ['grid-template']
		}]
	}
}

