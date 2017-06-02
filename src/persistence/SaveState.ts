import { OpaqueToken, Inject, Injectable } from "@angular/core";
import { Action, Store } from '@ngrx/store';
import { EffectHandler, IEffectsHandler } from '../EffectsHandler';
import { IStateStorageToken, IStateStorage } from './IStateStorage';

export const SaveStateEffectType = "[EFFECT] Save the application's state";

export class SaveStateEffect implements Action {
    type = SaveStateEffectType;
    constructor(
        public payload?: any
    ) {
    }
}
@Injectable()
@EffectHandler(SaveStateEffectType)
export class SaveStateEffectHandler implements IEffectsHandler {
    state: any;
    constructor(
        store: Store<any>,
        @Inject(IStateStorageToken) private _stateStorage: IStateStorage
    ) {
        store.select( s => s ).subscribe( s => this.state = s)
    }

    execute(action: SaveStateEffect) {
        const state = action.payload || this.state;
        if (state !== undefined) {
            this._stateStorage.write(state);
        }
    }
}
