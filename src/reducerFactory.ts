import { Action } from '@ngrx/Store';
import { ActionHandlerResolver } from './Resolver';

export function reducerFactory<T>(handlers: any[], initialState: T): (state: T, action: Action) => T {
    const resolver = new ActionHandlerResolver(handlers);

    function reducer(state = initialState, action: Action): T {
        
        const handlerClass = resolver.resolve(action);
        if (handlerClass) {
            const handler = new handlerClass();
            return handler.apply(state, action);
        }

        return state;
    }

    return reducer;
}
