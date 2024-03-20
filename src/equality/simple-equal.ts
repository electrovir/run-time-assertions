import {AssertionError} from '../assertion.error';

/** Checks that inputs are equal with `===`. */
export function isStrictEqual(a: unknown, b: unknown): boolean {
    return a === b;
}

/** Checks that inputs are equal with `==`. */
export function isLooseEqual(a: unknown, b: unknown): boolean {
    return a == b;
}

/**
 * Asserts that inputs are equal with `===`.
 *
 * @throws AssertionError if the inputs are not equal
 */
export function assertStrictEqual(a: unknown, b: unknown): void {
    if (!isStrictEqual(a, b)) {
        throw new AssertionError('Inputs are not strictly equal.');
    }
}

/**
 * Asserts that inputs are equal with `==`.
 *
 * @throws AssertionError if the inputs are not equal
 */
export function assertLooseEqual(a: unknown, b: unknown): void {
    if (!isLooseEqual(a, b)) {
        throw new AssertionError('Inputs are not loosely equal.');
    }
}
