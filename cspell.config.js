const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        '/docs/',
    ],
    words: [
        ...baseConfig.words,
    ],
};
