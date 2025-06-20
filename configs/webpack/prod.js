// production config
const { merge } = require('webpack-merge');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  plugins: [
    new MonacoWebpackPlugin({
      // Only include the languages/features you actually use
      languages: ['javascript', 'python', 'typescript'],
      features: ['coreCommands', 'find', 'bracketMatching', 'comment', 'folding'],
    }),
  ],
});