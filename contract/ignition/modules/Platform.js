const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PlatformModule", (m) => {

  const platform = m.contract("Platform");

  return { platform };
});
