export const getUniqID = (): string => Math.random().toString(36).slice(2);

export const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number = 100) => {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};