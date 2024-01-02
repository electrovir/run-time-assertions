import {hasProperty} from './has-property';

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

export function isPromise<T>(
    input: T | unknown,
): input is T extends PromiseLike<infer Value> ? Promise<Value> : Promise<unknown> {
    return input instanceof Promise;
}
