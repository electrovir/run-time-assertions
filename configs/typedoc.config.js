const {resolve, join} = require('path');

const repoRoot = resolve(__dirname, '..');

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    cacheBust: true,
    cleanOutputDir: true,
    entryPoints: [
        join(repoRoot, 'src', 'index.ts'),
    ],
    githubPages: true,
    includeVersion: true,
    out: join(repoRoot, 'docs'),
    requiredToBeDocumented: [
        'Accessor',
        'CallSignature',
        'Class',
        'Constructor',
        'ConstructorSignature',
        'Enum',
        'Function',
        'GetSignature',
        'IndexSignature',
        'Interface',
        'Method',
        'Module',
        'Namespace',
        'Parameter',
        'Reference',
        'SetSignature',
        'TypeAlias',
        'TypeLiteral',
        'Variable',
    ],
    searchInComments: true,
    skipErrorChecking: true,
    treatWarningsAsErrors: true,
    validation: {
        notExported: true,
        invalidLink: true,
        notDocumented: true,
    },
};
