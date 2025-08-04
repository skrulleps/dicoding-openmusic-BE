const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const daStyle = require('eslint-config-dicodingacademy');

module.exports = defineConfig([
  daStyle,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node, sourceType: 'module' },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      }]
    }
  },
]);