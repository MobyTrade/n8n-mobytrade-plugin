module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/nodes',
	],
	rules: {
		'n8n-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
		'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'error',
		'n8n-nodes-base/node-class-description-name-unsuffixed-trigger-node': 'error',
		'n8n-nodes-base/node-filename-against-convention': 'error',
		'n8n-nodes-base/node-class-description-icon-not-svg': 'error',
		'n8n-nodes-base/cred-class-field-name-unsuffixed': 'error',
		'n8n-nodes-base/cred-class-name-unsuffixed': 'error',
		'n8n-nodes-base/cred-filename-against-convention': 'error',
		'n8n-nodes-base/node-class-description-name-miscased': 'error',
	},
};