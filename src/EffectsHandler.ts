import 'reflect-metadata';
import { Action } from '@ngrx/Store';
import { Observable } from 'rxjs/Observable';
import { ActionClass } from './ActionClass';

export const EffectsHandlerMetaKey = 'EffectsHandlerMetaKey';

export interface EffectsHandlerMeta {
    actionType: string;
}

export interface IEffectsHandler {
    execute<TAction extends Action>(action: TAction):
        // tslint:disable-next-line:max-line-length
        Action | Action[] | Promise<void> | Promise<Action> | Promise<Action[]> | Observable<void> | Observable<Action> | Observable<Action[]> | void;
}

export function EffectHandler(actionTypeOrClass: string | ActionClass) {
    let actionType;

    if (typeof actionTypeOrClass === 'string') {
        actionType = actionTypeOrClass;
    }
    else if (typeof actionTypeOrClass === 'function') {
        actionType = actionTypeOrClass.prototype.type;
        if (!actionType) {
            const action = new actionTypeOrClass(null);
            actionType = action.type;
        }
    }
    if (!actionType) {
        throw 'The action type must be specified';
    }

    return function(target: Function) {
        Reflect.defineMetadata(EffectsHandlerMetaKey, {actionType}, target);
    };
}
