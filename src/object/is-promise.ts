import {hasProperty} from './has-property';

/**
 * Checks if a value is promise _like_. This means that the value has a `.then()` function property.
 * It might not have the other properties expected from the `Promise` class, however.
 */
export function isPromiseLike<T>(
    input: T | unknown,
): input is T extends PromiseLike<infer Value> ? PromiseLike<Value> : PromiseLike<unknown> {
    if (isPromise(input)) {
        return true;
    } else if (hasProperty(input, 'then') && typeof input.then === 'function') {
        return true;
    }

    return false;
}

/**
 * Checks if a value is an actual `Promise` object. In reality this is just a simple wrapper for
 * `instanceof Promise`, but it makes checking a bit more ergonomic.
 */
export function isPromise<T>(
    input: T | unknown,
): input is T extends PromiseLike<infer Value> ? Promise<Value> : Promise<unknown> {
    return input instanceof Promise;
}
