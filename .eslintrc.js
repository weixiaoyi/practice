module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  parser: "babel-eslint",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react", "react-hooks"],
  // add your custom rules here
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": 0,
  },
};
