# To Fix ES Lint issueS:

## install the plugin

- npm install --save-dev eslint-plugin-cypress

- add to eslint.config.js

- {
  files: ['cypress/**/*.{js,jsx}'],
  extends: [cypress.configs.recommended],
  }
