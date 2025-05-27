export function distinct<T>(array: T[]): T[] {
    return [...new Set(array)];
}

export function distinctBy<T, K>(array: T[], key: (item: T) => K): T[] {
    return [...new Map(array.map(item => [key(item), item])).values()];
}