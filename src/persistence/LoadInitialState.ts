import { OpaqueToken, Inject } from '@angular/core';
import { Action } from '@ngrx/Store';
import { ISerializableState } from './ISerializableState';
import { ActionHandler, IActionHandler } from '../ActionHandler';
import { EffectHandler, IEffectsHandler } from '../EffectsHandler';
import { IStateStorageToken, IStateStorage } from './IStateStorage';

export const SetInitialStateActionType = '[ACTION] SET THE INITIAL STATE';
export const LoadInitialStateEffectType = '[EFFECT] SET THE INITIAL STATE';

export class SetInitialStateAction {
    type = SetInitialStateActionType;

    constructor(
        public payload: ISerializableState<any>
     ) {}
}

export class SetInitialStateActionHandler implements IActionHandler {
    apply(state: ISerializableState<any>, action: SetInitialStateAction): ISerializableState<any> {
        return state;
    }
}

export class LoadInitialStateEffect {
    type = LoadInitialStateEffectType;
}

export class LoadInitialStateEffectHandler implements IEffectsHandler {
    constructor(
        @Inject(IStateStorageToken) private _stateStorage: IStateStorage
    ) {
    }

    async execute(action: LoadInitialStateEffect) {
        const state = await this._stateStorage.read<ISerializableState<any>>();
        return new SetInitialStateAction(state);
    }
}
