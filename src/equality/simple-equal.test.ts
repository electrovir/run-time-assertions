import {itCases} from '@augment-vir/browser-testing';
import {AssertionError} from '../assertion.error';
import {assertLooseEqual, assertStrictEqual, isLooseEqual, isStrictEqual} from './simple-equal';

describe(isStrictEqual.name, () => {
    itCases(isStrictEqual, [
        {
            it: 'accepts equal inputs',
            inputs: [
                4,
                4,
            ],
            expect: true,
        },
        {
            it: 'rejects unequal inputs',
            inputs: [
                1,
                4,
            ],
            expect: false,
        },
    ]);
});

describe(isLooseEqual.name, () => {
    itCases(isLooseEqual, [
        {
            it: 'accepts equal inputs',
            inputs: [
                4,
                4,
            ],
            expect: true,
        },
        {
            it: 'rejects unequal inputs',
            inputs: [
                1,
                4,
            ],
            expect: false,
        },
        {
            it: 'accepts equal inputs of different types',
            inputs: [
                '4',
                4,
            ],
            expect: true,
        },
    ]);
});

describe(assertStrictEqual.name, () => {
    itCases(assertStrictEqual, [
        {
            it: 'passes equal inputs',
            inputs: [
                4,
                4,
            ],
            throws: undefined,
        },
        {
            it: 'rejects unequal inputs',
            inputs: [
                1,
                4,
            ],
            throws: AssertionError,
        },
    ]);
});

describe(assertLooseEqual.name, () => {
    itCases(assertLooseEqual, [
        {
            it: 'accepts equal inputs',
            inputs: [
                4,
                4,
            ],
            throws: undefined,
        },
        {
            it: 'rejects unequal inputs',
            inputs: [
                1,
                4,
            ],
            throws: AssertionError,
        },
        {
            it: 'accepts equal inputs of different types',
            inputs: [
                '4',
                4,
            ],
            throws: undefined,
        },
    ]);
});
