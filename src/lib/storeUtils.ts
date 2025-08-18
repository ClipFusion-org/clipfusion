export type ValueOrUpdater<T> = Partial<T> | ((prev: T) => Partial<T>);
export type Updater<T> = (valueOrUpdater: ValueOrUpdater<T>) => void;
export type ValueAndSetter<T> = [T, Updater<T>];

export const getValue = <T>(state: T | undefined, value: ValueOrUpdater<T>): Partial<T> => {
    return typeof value === 'function'
        ? value(state || {} as T)
        : value;
};