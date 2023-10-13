import {
    extractErrorMessage,
    isPromiseLike,
    isRuntimeTypeOf,
    MaybePromise,
    PartialAndNullable,
    TypedFunction,
} from '@augment-vir/common';
import {AssertionError} from './assertion.error';

/** Matching options for a thrown error constructor or message string. */
export type ErrorMatchOptions = PartialAndNullable<{
    matchMessage: string | RegExp;
    matchConstructor: ErrorConstructor | typeof Error | {new (...args: any[]): Error};
}>;

/** Allowed inputs for asserting if something throws. */
export type CallbackOrPromise =
    | TypedFunction<[], MaybePromise<any>>
    | TypedFunction<[], Promise<any>>
    | TypedFunction<[], any>
    | Promise<any>;

/**
 * Asserts that the given callback or promise throws and that what it throws matches, if provided,
 * the provided constructor or message string.
 */
export function assertThrows(
    /** The callback or promise to check for throwing. */
    callback: Promise<any>,
    /** Optional matching options. */
    matching?: ErrorMatchOptions | undefined,
    /** Message to include in the error if the provided callback or promise does not throw. */
    failureMessage?: string,
): Promise<void>;
/**
 * Asserts that the given callback or promise throws and that what it throws matches, if provided,
 * the provided constructor or message string.
 */
export function assertThrows(
    /** The callback or promise to check for throwing. */
    callback: TypedFunction<[], Promise<any>>,
    /** Optional matching options. */
    matching?: ErrorMatchOptions | undefined,
    /** Message to include in the error if the provided callback or promise does not throw. */
    failureMessage?: string,
): Promise<void>;
/**
 * Asserts that the given callback or promise throws and that what it throws matches, if provided,
 * the provided constructor or message string.
 */
export function assertThrows(
    /** The callback or promise to check for throwing. */
    callback: TypedFunction<[], any>,
    /** Optional matching options. */
    matching?: ErrorMatchOptions | undefined,
    /** Message to include in the error if the provided callback or promise does not throw. */
    failureMessage?: string,
): void;
/**
 * Asserts that the given callback or promise throws and that what it throws matches, if provided,
 * the provided constructor or message string.
 */
export function assertThrows(
    /** The callback or promise to check for throwing. */
    callback: TypedFunction<[], MaybePromise<any>>,
    /** Optional matching options. */
    matching?: ErrorMatchOptions | undefined,
    /** Message to include in the error if the provided callback or promise does not throw. */
    failureMessage?: string,
): MaybePromise<void>;
/**
 * Asserts that the given callback or promise throws and that what it throws matches, if provided,
 * the provided constructor or message string.
 */
export function assertThrows(
    /** The callback or promise to check for throwing. */
    callbackOrPromise: CallbackOrPromise,
    /** Optional matching options. */
    matching?: ErrorMatchOptions | undefined,
    /** Message to include in the error if the provided callback or promise does not throw. */
    failureMessage?: string,
): MaybePromise<void>;
/**
 * Asserts that the given callback or promise throws and that what it throws matches, if provided,
 * the provided constructor or message string.
 */
export function assertThrows(
    /** The callback or promise to check for throwing. */
    callbackOrPromise: CallbackOrPromise,
    /** Optional matching options. */
    matching?: ErrorMatchOptions | undefined,
    /** Message to include in the error if the provided callback or promise does not throw. */
    failureMessage?: string,
): MaybePromise<void> {
    let caughtError: any = undefined;
    const errorSuffix = failureMessage ? `: ${failureMessage}` : '.';

    function runAssertion() {
        if (!caughtError) {
            throw new AssertionError(`An error was was expected but missing${errorSuffix}`);
        }

        if (matching?.matchConstructor && !(caughtError instanceof matching.matchConstructor)) {
            throw new AssertionError(
                `Error did not match expected constructor '${matching.matchConstructor.name}'${errorSuffix}`,
            );
        }

        if (matching?.matchMessage) {
            const message = extractErrorMessage(caughtError);

            if (
                isRuntimeTypeOf(matching.matchMessage, 'string') &&
                !message.includes(matching.matchMessage)
            ) {
                throw new AssertionError(
                    `Error message did not contain '${matching.matchMessage}'${errorSuffix}`,
                );
            } else if (!message.match(matching.matchMessage)) {
                throw new AssertionError(
                    `Error message did not match '${matching.matchMessage}'${errorSuffix}`,
                );
            }
        }
    }

    try {
        const result =
            callbackOrPromise instanceof Promise ? callbackOrPromise : callbackOrPromise();

        if (isPromiseLike(result)) {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    await result;
                } catch (error) {
                    caughtError = error;
                }

                try {
                    runAssertion();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }
    } catch (error) {
        caughtError = error;
    }

    runAssertion();
}
