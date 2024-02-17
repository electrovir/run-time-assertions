import {Primitive} from 'type-fest';
import {AssertionError} from './assertion.error';
import {getRunTimeType, isRunTimeType} from './run-time-types';

/** Asserts that the given value is a primitive. */
export function assertIsPrimitive(
    value: unknown,
    failureMessage?: string | undefined,
): asserts value is Primitive {
    /**
     * `null` is a primitive but `typeof null` gives `'object'` so we have to special case `null`
     * here.
     */
    if (value === null) {
        return;
    }

    if (typeof value === 'object' || typeof value === 'function') {
        throw new AssertionError(failureMessage || 'value is not a primitive');
    }
}

/** Checks if the given value is a primitive or not. */
export function isPrimitive(value: unknown): value is Primitive {
    try {
        assertIsPrimitive(value);
        return true;
    } catch (error) {
        return false;
    }
}

/** Asserts that the given value is a PropertyKey ( string | number | symbol). */
export function assertIsPropertyKey(
    value: unknown,
    failureMessage?: string | undefined,
): asserts value is PropertyKey {
    if (
        isRunTimeType(value, 'string') ||
        isRunTimeType(value, 'number') ||
        isRunTimeType(value, 'symbol')
    ) {
        return;
    } else {
        throw new AssertionError(
            failureMessage ||
                `value is of type '${getRunTimeType(value)}' but expected a PropertyKey.`,
        );
    }
}

/** Tests if the given value is a PropertyKey ( string | number | symbol). */
export function isPropertyKey(value: unknown): value is PropertyKey {
    try {
        assertIsPropertyKey(value);
        return true;
    } catch (error) {
        return false;
    }
}
