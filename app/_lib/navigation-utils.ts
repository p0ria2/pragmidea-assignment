export function toSearchParams(values: Record<string, any>) {
    return Object.entries(values)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}
