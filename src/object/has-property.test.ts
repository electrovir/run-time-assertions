import {itCases} from '@augment-vir/browser-testing';
import {randomInteger, randomString} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';
import {hasProperties, hasProperty, isPropertyOf} from './has-property';
import {isSomeObject} from './is-object';
import {isPromiseLike} from './is-promise';

describe(hasProperty.name, () => {
    itCases(hasProperty, [
        {
            it: 'accepts an existing property',
            inputs: [
                {
                    a: 1,
                    b: 2,
                },
                'b',
            ],
            expect: true,
        },
        {
            it: 'rejects a missing property',
            inputs: [
                {a: 1, b: 2},
                'blah',
            ],
            expect: false,
        },
        {
            it: 'accepts function keys',
            inputs: [
                () => {},
                'name',
            ],
            expect: true,
        },
        {
            it: 'rejects missing functions keys',
            inputs: [
                () => {},
                'concat',
            ],
            expect: false,
        },
        {
            it: 'accepts string object keys',
            inputs: [
                'hello there',
                'concat',
            ],
            expect: true,
        },
        {
            it: 'rejects missing string object keys',
            inputs: [
                'hello there',
                'name',
            ],
            expect: false,
        },
    ]);

    it('type guards the object with an unknown property', () => {
        const idkWhatThisIs: unknown = (() => {}) as unknown;
        if (hasProperty(idkWhatThisIs, 'name')) {
            idkWhatThisIs.name;
            assertTypeOf(idkWhatThisIs.name).toBeUnknown();
            /** Allows extra properties to be type guarded as well. */
            if (hasProperty(idkWhatThisIs, 'derp')) {
                idkWhatThisIs.derp;
                assertTypeOf(idkWhatThisIs.name).toBeUnknown();
                assertTypeOf(idkWhatThisIs.derp).toBeUnknown();
            }
        } else {
            // @ts-expect-error
            idkWhatThisIs.name;
        }
    });

    it('preserves the property type when known', () => {
        const whatever = {} as {name: string} | string | {derp: string};

        /** Should not be able to access the property in a union before type guarding it. */
        // @ts-expect-error
        whatever.name;

        if (hasProperty(whatever, 'name')) {
            whatever.name;
            assertTypeOf(whatever.name).toEqualTypeOf<string>();
        }
    });

    it('preserves function properties', () => {
        const withFunction = {} as {callback: Function} | {stuff: string};

        if (hasProperty(withFunction, 'callback')) {
            withFunction.callback;

            withFunction.callback();
        } else if (
            hasProperty(withFunction, 'otherCallback') &&
            typeof withFunction.otherCallback === 'function'
        ) {
            withFunction.otherCallback();
        }
    });

    it('enforces that an optional property exists', () => {
        const whatever = {} as {name?: string};

        /** Can access the optional property but it might be undefined. */
        const maybeUndefined: string | undefined = whatever.name;
        // @ts-expect-error
        const failsDefinedOnly: string = whatever.name;

        if (hasProperty(whatever, 'name')) {
            assertTypeOf(whatever.name).toEqualTypeOf<string>();
        }
    });

    it('works with type parameters', () => {
        function testIsPromiseLike<T>(input: T) {
            if (hasProperty(input, 'then')) {
                input.then;
            }
        }
        testIsPromiseLike({});
    });

    it('allows further type narrowing', () => {
        function assertOutputProperty(
            keyPath: string,
            testExpectations: object,
            outputKey: string,
        ): void {
            if (!hasProperty(testExpectations, outputKey)) {
                throw new Error(`${keyPath} > ${outputKey} is missing.`);
            }

            const value = testExpectations[outputKey];

            if (typeof value !== 'string' && !isSomeObject(value)) {
                throw new Error(`${keyPath} > "${outputKey}" is invalid. Got "${value}"`);
            } else if (isSomeObject(value)) {
                if (!hasProperty(value, 'type') || value.type !== 'regexp') {
                    throw new Error(
                        `${keyPath} > "${outputKey}".type is invalid. Expected "regexp".`,
                    );
                }

                value;

                if (!hasProperty(value, 'value') || typeof value.value !== 'string') {
                    throw new Error(
                        `${keyPath} > "${outputKey}".value is invalid. Expected a string.`,
                    );
                }
            }
        }
    });
});

describe(hasProperties.name, () => {
    const testObject = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
    };

    itCases(hasProperties, [
        {
            it: 'accepts existing properties',
            inputs: [
                {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4,
                    e: 5,
                },
                [
                    'a',
                    'b',
                    'c',
                    'd',
                    'e',
                ],
            ],
            expect: true,
        },
        {
            it: 'rejects if one property does not exist',
            inputs: [
                {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4,
                    e: 5,
                },
                [
                    'a',
                    'b',
                    'c',
                    'd',
                    'e',
                    'blah',
                ],
            ],
            expect: false,
        },
    ]);

    it('passes type checks', () => {
        const whatever = {} as {name: string} | string;

        /** Cannot access the property before it is type guarded. */
        // @ts-expect-error
        whatever.name;

        if (
            hasProperties(whatever, [
                'name',
            ])
        ) {
            whatever.name;
            // @ts-expect-error
            whatever.value;

            assertTypeOf(whatever.name).toEqualTypeOf<string>();
        }
        if (
            hasProperties(whatever, [
                'name',
                'value',
            ])
        ) {
            whatever.name;
            whatever.value;

            assertTypeOf(whatever.name).toEqualTypeOf<string>();
            assertTypeOf(whatever.value).toEqualTypeOf<string>();
        }

        type MaybePromise<T> =
            | (T extends Promise<infer ValueType> ? T | ValueType : Promise<T> | T)
            | undefined
            | {error: Error};

        const maybePromise = {} as MaybePromise<number>;

        if (isPromiseLike(maybePromise)) {
            const myPromise: PromiseLike<number> = maybePromise;
        } else if (hasProperty(maybePromise, 'error')) {
            const myError: Error = maybePromise.error;
        } else {
            maybePromise;
        }
    });
});

describe(isPropertyOf.name, () => {
    const exampleSymbol = Symbol('example');
    const randomStringKey = randomString();
    const randomNumberKey = randomInteger({max: 100, min: 0});

    itCases(isPropertyOf, [
        {
            it: 'passes with a string prop on an object',
            inputs: [
                randomStringKey,
                {[randomStringKey]: 0},
            ],
            expect: true,
        },
        {
            it: 'passes with a symbol prop on an object',
            inputs: [
                exampleSymbol,
                {[exampleSymbol]: 0},
            ],
            expect: true,
        },
        {
            it: 'passes with a numeric prop on an object',
            inputs: [
                randomNumberKey,
                {[randomNumberKey]: 0},
            ],
            expect: true,
        },
        {
            it: 'passes with a prop from a function',
            inputs: [
                'name',
                () => {},
            ],
            expect: true,
        },
        {
            it: 'fails with a string key that does not exists in a function',
            inputs: [
                randomStringKey,
                () => {},
            ],
            expect: false,
        },
        {
            it: 'fails with a string key that does not exists in a object',
            inputs: [
                randomStringKey,
                {},
            ],
            expect: false,
        },
        {
            it: 'fails with a numeric key that does not exists in a object',
            inputs: [
                randomNumberKey,
                {},
            ],
            expect: false,
        },
        {
            it: 'fails with a symbol key that does not exists in a object',
            inputs: [
                exampleSymbol,
                {},
            ],
            expect: false,
        },
    ]);
});
