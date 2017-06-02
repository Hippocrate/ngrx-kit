import {OpaqueToken} from "@angular/core";

export const IStateStorageToken = new OpaqueToken("IStateStorage");

export interface IStateStorage {
    read<T>(): T;
    write<T>(state: T);
}
