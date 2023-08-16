export const stringify : (id: number) => string;
export const parse : (dxid: string, throwError = false) => number;
export const luhn64 : (payload: string) => string;
