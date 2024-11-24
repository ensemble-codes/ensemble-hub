require("@nomicfoundation/hardhat-toolbox");

// Explicitly disable telemetry
process.env.HARDHAT_TELEMETRY_DISABLED = "1";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        hardhat: {
            chainId: 1337
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    gasReporter: {
        enabled: false
    },
    mocha: {
        timeout: 40000
    }
};