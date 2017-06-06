export interface ISerializableState<T> {
    loading: boolean;
    lastPersistedTime: number;
    state: T;
}
