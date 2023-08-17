module.exports = {
"settings": {
  "import/resolver": {
    "node": {
      "extensions": [".js", ".ts"],
      "moduleDirectory": ["src", "node_modules"]
    }
  }
},
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended" ,'airbnb-base'],
  overrides: [
{"files": [ "src/*.js" ],}
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
"import/extensions": ["error",{js:"ignorePackages"}],
"no-underscore-dangle": 0,
"no-bitwise":0,
"no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
  },
};
