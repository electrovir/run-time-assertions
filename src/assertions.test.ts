import {itCases} from '@augment-vir/browser-testing';
import {AssertionError} from './assertion.error';
import {assertDefined, assertInstanceOf, isDefined, isInstanceOf} from './assertions';

describe(assertInstanceOf.name, () => {
    itCases(assertInstanceOf, [
        {
            it: 'passes valid inputs',
            inputs: [
                /stuff/,
                RegExp,
            ],
            throws: undefined,
        },
        {
            it: 'fails invalid inputs',
            inputs: [
                'stuff',
                RegExp,
                'random message',
            ],
            throws: 'random message',
        },
        {
            it: 'fails invalid inputs',
            inputs: [
                0,
                RegExp,
            ],
            throws: AssertionError,
        },
    ]);
});

describe(isInstanceOf.name, () => {
    itCases(isInstanceOf, [
        {
            it: 'passes valid inputs',
            inputs: [
                /stuff/,
                RegExp,
            ],
            expect: true,
        },
        {
            it: 'fails invalid inputs',
            inputs: [
                'stuff',
                RegExp,
            ],
            expect: false,
        },
    ]);
});

describe(assertDefined.name, () => {
    itCases(assertDefined, [
        {
            it: 'passes valid inputs',
            inputs: [
                'something',
            ],
            throws: undefined,
        },
        {
            it: 'passes an empty string',
            inputs: [
                '',
            ],
            throws: undefined,
        },
        {
            it: 'passes on false',
            inputs: [
                false,
            ],
            throws: undefined,
        },
        {
            it: 'passes on 0',
            inputs: [
                0,
            ],
            throws: undefined,
        },
        {
            it: 'fails on undefined',
            inputs: [
                undefined,
                'random message',
            ],
            throws: 'random message',
        },
        {
            it: 'fails on null',
            inputs: [
                undefined,
            ],
            throws: AssertionError,
        },
    ]);
});

describe(isDefined.name, () => {
    itCases(isDefined, [
        {
            it: 'passes valid inputs',
            input: 'something',
            expect: true,
        },
        {
            it: 'passes an empty string',
            input: '',
            expect: true,
        },
        {
            it: 'passes on false',
            input: false,
            expect: true,
        },
        {
            it: 'passes on 0',
            input: 0,
            expect: true,
        },
        {
            it: 'fails on undefined',
            input: undefined,
            expect: false,
        },
        {
            it: 'fails on null',
            input: undefined,
            expect: false,
        },
    ]);
});
