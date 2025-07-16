const js = require('@eslint/js');
const globals = require('globals');
const {defineConfig} = require('eslint/config');
const daStyle = require('eslint-config-dicodingacademy');

export default defineConfig([
  daStyle,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node, sourceType: 'module' },
  },
]);