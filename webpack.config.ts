/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';

export default function configureWebpack(
	env: Record<string, string>,
	argv: Record<string, string>,
): webpack.Configuration {
	const mode = argv?.mode === 'development' ? 'development' : 'production';
	return {
		target: 'web',
		mode,
		entry: {
			index: path.join(__dirname, 'src', 'index.ts'),
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
				},
			],
		},
		resolve: {
			extensions: [
				'.ts',
				'.js',
			],
		},
		output: {
			filename: '[name].js',
			path: path.join(__dirname, 'dist'),
			library: {
				name: '@karuta/rest-client',
				type: 'umd',
			},
			devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		},
		devtool: mode !== 'production' ? 'inline-source-map' : undefined,
	};
}
