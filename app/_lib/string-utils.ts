export function capitalize(str: string) {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export function initials(str: string | null) {
    return str?.split(' ').map(name => name[0]).join('').toUpperCase() || '';
}
