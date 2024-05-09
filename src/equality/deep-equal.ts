import deepEqual from 'deep-eql';
import {AssertionError} from '../assertion.error';

/** Check if the inputs are deeply equal using the `deep-eql` package. */
export function isDeeplyEqual(a: unknown, b: unknown): boolean {
    return deepEqual(a, b);
}

/** Asserts that inputs are deeply equal using the `deep-eql` package. */
export function assertDeeplyEqual(a: unknown, b: unknown) {
    if (!isDeeplyEqual(a, b)) {
        throw new AssertionError('Inputs are not JSON equal.');
    }
}
