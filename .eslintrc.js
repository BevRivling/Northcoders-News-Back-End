module.exports = {
  extends: "airbnb-base",
  env: {
    mocha: true
  },
  rules: {
    "no-console": [0],
    "no-unused-vars": [
      1,
      {
        argsIgnorePattern: "Promise|res|next|^err"
      }
    ],
    "eslint.autoFixOnSave": true,
    "eslint.run": "onSave",
    "eslint.provideLintTask": false,
    'camelcase': 0,
    "func-names": 0,
    "arrow-body-style": ["warn"],
    "no-param-reassign": 0,
    "prefer-promise-reject-errors": 0,
    "files.useExperimentalFileWatcher": false,
    "git.ignoreLimitWarning": true
  }
};
