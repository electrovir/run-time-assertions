import {itCases} from '@augment-vir/browser-testing';
import {assert} from '@open-wc/testing';
import {assertThrows} from '../assert-throws';
import {arePropsStrictEqual, assertPropsStrictEqual} from './object-equality';

describe(arePropsStrictEqual.name, () => {
    it('passes props that are the same', () => {
        const prop1 = {};
        const prop2 = new Date();

        assert.isTrue(
            arePropsStrictEqual(
                {
                    prop1,
                    prop2,
                },
                {
                    prop1,
                    prop2,
                },
            ),
        );
        assertPropsStrictEqual(
            {
                prop1,
                prop2,
            },
            {
                prop1,
                prop2,
            },
        );
    });

    it('rejects props that are different', () => {
        const prop1 = {};
        const prop2 = new Date();

        assert.isFalse(
            arePropsStrictEqual(
                {
                    prop1,
                    prop2,
                },
                {
                    prop1,
                    prop2: new Date(),
                },
            ),
        );
        assertThrows(() =>
            assertPropsStrictEqual(
                {
                    prop1,
                    prop2,
                },
                {
                    prop1,
                    prop2: new Date(),
                },
            ),
        );
    });

    itCases(arePropsStrictEqual, [
        {
            it: 'rejects unequal primitives',
            inputs: [
                'a',
                'b',
            ],
            expect: false,
        },
        {
            it: 'accepts equal primitives',
            inputs: [
                'a',
                'a',
            ],
            expect: true,
        },
        {
            it: 'accepts equal non primitives',
            inputs: [
                {a: 'hi'},
                {a: 'hi'},
            ],
            expect: true,
        },
        {
            it: 'allows custom equality check',
            inputs: [
                {a: 'hi'},
                {a: 'hi'},
                () => false,
            ],
            expect: false,
        },
    ]);
});
