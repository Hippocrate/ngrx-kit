import { StoreModule } from '@ngrx/store';
import { LocalStateStorage } from './LocalStateStorage';
import { ModuleWithProviders } from '@angular/core';

export function restoreStore(reducer: any, storageKey: string): ModuleWithProviders {
    const storage = new LocalStateStorage(storageKey);
    const initialState = storage.read<any>();

    return StoreModule.provideStore(reducer, initialState);
}
