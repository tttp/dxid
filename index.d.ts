export const stringify : (id: number, addUnderscore = true) => string;
export const parse : (dxid: string, throwError = false) => number;
export const luhn64 : (payload: string) => string;
