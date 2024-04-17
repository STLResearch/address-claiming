export default {
  extends: [
    '@commitlint/config-conventional' // scoped packages are not prefixed
  ],
  rules: { 'references-empty': [2, 'never'] }
};
