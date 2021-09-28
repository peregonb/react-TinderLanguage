export const getUniqID = (arr: any[]): string => arr.length ? `${Math.max(...arr.map(el => el.key)) + 1}` : '0';