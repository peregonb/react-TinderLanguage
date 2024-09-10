type Action = () => void;
type Nullable<T> = T | null;
type ExcludeFields<T, F extends keyof T> = Omit<T, F>;
