export const createNestedKey = (...args: string[]): string => {
    return args.join(".");
}