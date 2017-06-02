import { ActionHandlerRegistry, EffectsHandlerRegistry, HandlerClass } from './HandlerRegistry';
import { IActionHandler } from './ActionHandler';
import { IEffectsHandler } from './EffectsHandler';

import { Action } from '@ngrx/store';

export class ActionHandlerResolver {
    private _registry?: ActionHandlerRegistry;

    constructor(handlers: any[]) {
        this._registry = new ActionHandlerRegistry(handlers);
    }

    resolve(action: Action) {
        return this._registry.get(action.type);
    }
}

export class EffectsHandlerResolver {
    private _registry?: EffectsHandlerRegistry;
    
    constructor(handlers: any[]) {
        this._registry = new EffectsHandlerRegistry(handlers);
    }

    resolve(action: Action) {
        return this._registry.get(action.type);
    }
}
