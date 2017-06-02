import { IActionHandler, ActionHandlerMetaKey } from './ActionHandler';
import { IEffectsHandler, EffectsHandlerMetaKey } from './EffectsHandler';

import 'reflect-metadata';

export interface HandlerClass<T> {
    new() : T;
}
export interface IHandlerRegistry<T> {
    register(...handler: HandlerClass<T>[]);
    get(actionType: string): HandlerClass<T>;
}


export class HandlerRegistryBase<T> implements IHandlerRegistry<T> {
    _handlers = new Map<string, HandlerClass<T>>();
    constructor(
        private _metaKey,
        private handlers?:  HandlerClass<T>[]
     ) {
         if (handlers) {
            this.register(...handlers);
         }
     }

    register(...handlers: HandlerClass<T>[]) {
        handlers.forEach( handler => {
            const {actionType} = Reflect.getMetadata(this._metaKey, handler) || { actionType: null};
            if (!actionType) {
                throw `Cannot register handler '${handler.name}' :  The Handler decorator is probably missing`;
            }
            const existing = this._handlers.get(actionType);
            if (existing && existing !== handler) {
                throw `Cannot register handler '${handler.name}' : The handler '${existing.name}' is already registered for the action type '${actionType}'`;
            }
            this._handlers.set(actionType, handler);
        });
    }

    get(actionType: string): HandlerClass<T> {
        return this._handlers.get(actionType);
    }
}

export class ActionHandlerRegistry extends HandlerRegistryBase<IActionHandler> {
    constructor( handlers?: any[]) {
        super(ActionHandlerMetaKey, handlers.filter( h => {
                return typeof h && h.prototype && typeof h.prototype.apply === 'function';
            })
        );
    }
}

export class EffectsHandlerRegistry extends HandlerRegistryBase<IEffectsHandler> {
    constructor( handlers?: any[]) {
        const effectsHandlers = handlers.filter( h => {
            return typeof h && h.prototype && typeof h.prototype.execute === 'function';
        });
        super(EffectsHandlerMetaKey, effectsHandlers);
    }
}
