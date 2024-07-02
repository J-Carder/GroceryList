module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,js,html}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};