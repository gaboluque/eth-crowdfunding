const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Remove previous build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// Read Campign.sol from contracts folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// Compile contracts with solidity compiler
const output = solc.compile(source, 1).contracts;

// Write output to /build directory
fs.ensureDirSync(buildPath);

for(let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, `${contract.replace(":", "")}.json`),
    output[contract]
  )
}
