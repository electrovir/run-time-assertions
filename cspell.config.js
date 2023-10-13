const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        '/docs/',
        '/configs/',
    ],
    words: [
        ...baseConfig.words,
    ],
};
