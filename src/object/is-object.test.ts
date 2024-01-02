import {itCases} from '@augment-vir/browser-testing';
import {isSomeObject} from './is-object';

describe(isSomeObject.name, () => {
    itCases(isSomeObject, [
        {
            it: 'accepts an empty object',
            input: {},
            expect: true,
        },
        {
            it: 'accepts a filled in object',
            input: {a: '4', b: '5'},
            expect: true,
        },
        {
            it: 'rejects null',
            input: null,
            expect: false,
        },
        {
            it: 'rejects functions',
            input: () => {},
            expect: false,
        },
        {
            it: 'rejects numbers',
            input: 4,
            expect: false,
        },
        {
            it: 'rejects strings',
            input: 'I am a string',
            expect: false,
        },
    ]);
});
