var plugin = [
	[
		require.resolve('babel-plugin-named-asset-import'),
		{
			loaderMap: {},
		},
	],
	[
		'import',
		{
			libraryName: 'antd',
			// style: true,
		},
		'antd',
	]
];

module.exports = plugin;
