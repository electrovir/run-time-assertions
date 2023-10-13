import {
    extractErrorMessage,
    isPromiseLike,
    isRuntimeTypeOf,
    MaybePromise,
    PartialAndNullable,
} from '@augment-vir/common';

export type ErrorMatchOptions = PartialAndNullable<{
    matchMessage: string | RegExp;
    matchConstructor: ErrorConstructor | typeof Error | {new (...args: any[]): Error};
}>;

export function assertThrows(
    callback: Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): Promise<void>;
export function assertThrows(
    callback: () => Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): Promise<void>;
export function assertThrows(
    callback: () => any,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): void;
export function assertThrows(
    callback: () => MaybePromise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void>;
export function assertThrows(
    callbackOrPromise:
        | (() => MaybePromise<any>)
        | (() => Promise<any>)
        | (() => any)
        | Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void>;
export function assertThrows(
    callbackOrPromise:
        | (() => MaybePromise<any>)
        | (() => Promise<any>)
        | (() => any)
        | Promise<any>,
    matching?: ErrorMatchOptions | undefined,
    failureMessage?: string,
): MaybePromise<void> {
    let caughtError: any = undefined;
    const errorSuffix = failureMessage ? `: ${failureMessage}` : '.';

    function runAssertion() {
        if (!caughtError) {
            throw new Error(`An error was was expected but missing${errorSuffix}`);
        }

        if (matching?.matchConstructor && !(caughtError instanceof matching.matchConstructor)) {
            throw new Error(
                `Error did not match expected constructor '${matching.matchConstructor.name}'${errorSuffix}`,
            );
        }

        if (matching?.matchMessage) {
            const message = extractErrorMessage(caughtError);

            if (
                isRuntimeTypeOf(matching.matchMessage, 'string') &&
                !message.includes(matching.matchMessage)
            ) {
                throw new Error(
                    `Error message did not contain '${matching.matchMessage}'${errorSuffix}`,
                );
            } else if (!message.match(matching.matchMessage)) {
                throw new Error(
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
