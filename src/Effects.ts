import { Inject, Injector, Injectable , ReflectiveInjector , OpaqueToken } from '@angular/core';
import { EffectsHandlerResolver } from './Resolver';
import { Actions, Effect } from '@ngrx/effects';
import { IEffectsHandler } from './EffectsHandler';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { PersistenceConfiguration, SaveStateEffect } from './persistence';
import {ActionEffectMetaKey, ActionEffectMetadata} from './EffectDispatcher';
import {HandlerClass} from './HandlerRegistry';

export const EffectsHandlerToken = new OpaqueToken("EffectsHandlerToken");

export interface EffectInfo {
    action: Action,
    handlerClass: HandlerClass<IEffectsHandler>,
    meta: ActionEffectMetadata,
    result?: any
}

@Injectable()
export class Effects {
    private _resolver: EffectsHandlerResolver;
    private _actionCache: Map<Action, EffectInfo> = new Map();
    
    constructor(
        private actions$: Actions,
        private _injector: Injector,
        private persistenceConfig: PersistenceConfiguration,
        private store: Store<any>,

        @Inject(EffectsHandlerToken) handlers: any[]
    ) {
        this._resolver = new EffectsHandlerResolver(handlers);
        if (persistenceConfig.autoSave) {
            this.store
                .select( s => s )
                .debounceTime(persistenceConfig.autoSaveDebounce)
                .subscribe( s => store.dispatch( new SaveStateEffect(s) ) )
        }
    }

  @Effect() effects$ = this.actions$
        .map( action => { 
            let actionInfo = { 
                action, 
                handlerClass: this._resolver.resolve(action),
                meta: this.readMeta(action)
            };
            if (!actionInfo.handlerClass) {
                const errorMsg = `No handler register for action "${action}"`;
                actionInfo.meta.reject(errorMsg);
                console.warn(errorMsg)
            }

            return actionInfo;
        })
        .filter( ({action, handlerClass}) => !!handlerClass )
        .map( ({action, handlerClass, meta}) => {
            const handler: IEffectsHandler = this._injector.get(handlerClass);
            const result = handler.execute(action);
            let observable: Observable<any>;

            if (result === undefined) {
                observable = Observable.of([this.emptyAction()]);
            } 
            else if (result instanceof Promise) {
                observable = Observable.from(<any>result);
            }
            else if (result instanceof Observable) {
                observable = result;
            }
            else {
                observable = Observable.of(result);
            }

            return observable.do( r => {
                if (meta) {
                    meta.resolve();
                }
            } ).catch( e => {
                meta.reject(e);
                return this.errorAction();
            });
        })
        .switchMap( (res: any) => res)
        .map((result: any) => {
            
            if (result && result[Symbol.iterator] || result instanceof Array) {
                if (!result.size && !result.length ) {
                    return [this.emptyAction()];
                }

                return result;
            } 
            return [result];
        } )
        .flatMap( (res: any) => res)
        .map( (result: any) => {
            if (result === undefined) {
                return this.undefinedAction();
            }
            if (this.isAction(result) ) {
                return result;
            }
            throw `Invalid effect result '${result}' allowed: Action | Action[] | Promise<void> |  Promise<Action> | Promise<Action[]> | Observable<void> | Observable<Action> | Observable<Action[]> | void`
        })
        .catch( (e, r) => {
            console.error(e);
            return this.errorAction();
        });

    isAction(value) {
        return value && typeof value.type === 'string'
    }

    emptyAction() {
        return  { type: `PRODUCE NO MUTATION` };
    }

    errorAction() {
        return  { type: `ERROR_ACTION` };
    }

    undefinedAction() {
        return  { type: `UNDEFINED VALUE IS OMITTED` };
    }

    isActionArray(values) {
        if (values && values[Symbol.iterator]) {
            for (var val of values) {
                if (!this.isAction(val)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    readMeta(action: Action): ActionEffectMetadata {
        return Reflect.getMetadata(ActionEffectMetaKey, action)
    }
}
