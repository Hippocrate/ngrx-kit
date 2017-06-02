import { StoreModule } from '@ngrx/store';
import { LocalStateStorage } from './LocalStateStorage';

export function restoreStore(reducer: any, storageKey: string) {
    const storage = new LocalStateStorage(storageKey);
    const initialState = storage.read<any>();

    return StoreModule.provideStore(reducer, initialState);
}
