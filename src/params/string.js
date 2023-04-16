export function match(params) {
    return /^[A-Za-z0-9_\s]+$/.test(params);
}