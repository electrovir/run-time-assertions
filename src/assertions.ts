import {Constructor} from 'type-fest';
import {AssertionError} from './assertion.error';

/** Wraps the JavaScript built-in "instanceof" in a type guard assertion. */
export function assertInstanceOf<InstanceType>(
    /** The value to check. */
    instance: unknown,
    /** The constructor that the "instance" input will be checked against. */
    classConstructor: Constructor<InstanceType>,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts instance is InstanceType {
    if (!(instance instanceof classConstructor)) {
        throw new AssertionError(failureMessage || `instanceof assertion failed`);
    }
}

/** Wraps the JavaScript built-in "instanceof" in a type guard. */
export function isInstanceOf<InstanceType>(
    /** The value to check. */
    instance: unknown,
    /** The constructor that the "instance" input will be checked against. */
    classConstructor: Constructor<InstanceType>,
): instance is InstanceType {
    try {
        assertInstanceOf(instance, classConstructor);
        return true;
    } catch (error) {
        if (error instanceof AssertionError) {
            return false;
            // just a safeguard that we can't intentionally trigger
            /* c8 ignore next 3 */
        } else {
            throw error;
        }
    }
}

/** Asserts that the given input is defined (not null and not undefined) */
export function assertDefined<T>(
    /** The value to check. */
    input: T,
    /** Message to include in error message if this assertion fails. */
    failureMessage?: string | undefined,
): asserts input is NonNullable<T> {
    if (input == undefined) {
        throw new AssertionError(failureMessage || 'defined assertion failed');
    }
}

/** Checks that the given input is defined (not null and not undefined) */
export function isDefined<T>(
    /** The value to check. */
    input: T,
): input is NonNullable<T> {
    try {
        assertDefined(input);
        return true;
    } catch (error) {
        if (error instanceof AssertionError) {
            return false;
            // just a safeguard that we can't intentionally trigger
            /* c8 ignore next 3 */
        } else {
            throw error;
        }
    }
}
