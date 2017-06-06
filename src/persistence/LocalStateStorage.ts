import { IStateStorage } from './IStateStorage';

export class LocalStateStorage implements IStateStorage {
    constructor(private _storageKey: string) {}
    read<T>(): T {
        const jsonState = localStorage.getItem(this._storageKey);
        if (jsonState) {
            try {
                const state = JSON.parse(jsonState);
                return state;
            } catch (e) {
                throw e;
            }
        }
    }

    write<T>(state: T) {
        const jsonState = JSON.stringify(state);
        localStorage.setItem(this._storageKey, jsonState);
    }
}
