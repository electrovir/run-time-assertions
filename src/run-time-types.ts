import type {AnyFunction} from '@augment-vir/common';
import {AssertionError} from './assertion.error';

/** This function is not used at run time, it's only here for types. */
/* c8 ignore next 3 */
function rawGetTypeOf(x: any) {
    return typeof x;
}

/** Raw outputs from the typeof operator. */
export type RawTypeOfOutput = ReturnType<typeof rawGetTypeOf>;

/**
 * The available run-time type options. In addition to the options returned by the built-in `typeof`
 * operator, this adds `'array'` as a type string.
 */
export type RunTimeType = RawTypeOfOutput | 'array';

/** The type that each RunTimeType string maps to. */
export type RunTimeTypeMapping = {
    array: unknown[] | ReadonlyArray<unknown>;
    bigint: bigint;
    boolean: boolean;
    function: AnyFunction | Readonly<AnyFunction>;
    number: number;
    object: Record<PropertyKey, unknown> | Readonly<Record<PropertyKey, unknown>>;
    string: string;
    symbol: symbol;
    undefined: undefined;
};

/**
 * Gets the run time type of the input. Note that this returns `'array'` for arrays rather than
 * 'object' (vs the built-in `typeof` operator that return `'object'` for both arrays and objects.)
 */
export function getRunTimeType(input: unknown): RunTimeType {
    return Array.isArray(input) ? 'array' : typeof input;
}

/** Checks if the input matches the given test type. */
export function isRunTimeType<T extends RunTimeType>(
    input: unknown,
    testType: T,
): input is RunTimeTypeMapping[T] {
    const inputType = getRunTimeType(input);
    return inputType === testType;
}

/**
 * Asserts that the given input matches the given test type. Note that an name for the input must be
 * provided for error messaging purposes.
 */
export function assertRunTimeType<T extends RunTimeType>(
    input: unknown,
    testType: T,
    failureMessage: string | undefined,
): asserts input is RunTimeTypeMapping[T] {
    if (!isRunTimeType(input, testType)) {
        throw new AssertionError(
            failureMessage ||
                `value is of type '${getRunTimeType(input)}' but type '${testType}' was expected.`,
        );
    }
}
