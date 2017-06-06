import 'reflect-metadata';
import {Injectable} from '@angular/core';
import {Store, Action} from '@ngrx/store';
import {Observable} from 'rxjs';

export const ActionEffectMetaKey = 'ActionHandlerMetaKey';

export interface  ActionEffectMetadata {
    token: EffectTicket;
    resolve: () => void;
    reject: (reason?: string) => void;
}

export interface CancelationCallback {
    (): void;
}

export class EffectTicket {
    action: Action;
    done: Promise<void>;

    constructor(action: Action) {
        this.action = action;
    }
}

@Injectable()
export class EffectDispatcher {
    constructor(
        private store: Store<any>
    ) {}

    dispatch(action: Action): EffectTicket {
        const effectTicket =  new  EffectTicket(action);
        const promise = new Promise<void>( (resolve, reject) => {
            let meta: ActionEffectMetadata = {
                resolve,
                reject,
                token: effectTicket
            };

            Reflect.defineMetadata(ActionEffectMetaKey, meta, action);
            this.store.dispatch(action);
        } );

        effectTicket.done = promise;
        return effectTicket;
    }
}
