import eslintPluginAstro from 'eslint-plugin-astro';
export default [
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    rules: {
      'astro/no-set-html-directive': 'warn',
    },
  },
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
];
