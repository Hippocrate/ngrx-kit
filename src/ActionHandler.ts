import { Action } from '@ngrx/Store';
import 'reflect-metadata';
import { ActionClass } from './ActionClass';

export const ActionHandlerMetaKey = 'ActionHandlerMetaKey';
export interface ActionHandlerMeta {
    actionType: string;
}

export interface IActionHandler {
    apply<TState, TAction extends Action>(state: TState, action: TAction): TState;
}

export function ActionHandler(actionTypeOrClass: string | ActionClass) {
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
        Reflect.defineMetadata(ActionHandlerMetaKey, {actionType}, target);
    }
}
