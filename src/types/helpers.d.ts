type Action = () => void;
type Nullable<T> = T | null;
type Undefined<T> = T | undefined;
type ExcludeFields<T, F extends keyof T> = Omit<T, F>;
