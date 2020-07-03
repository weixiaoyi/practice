const {
  override,
  addDecoratorsLegacy,
  useBabelRc,
  addBabelPlugins,
} = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy(),
  addBabelPlugins(["@babel/plugin-proposal-throw-expressions"]),
  useBabelRc()
);
