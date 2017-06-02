import { Subscription } from 'rxjs';

export interface ISubscriber {
    subscribe();
    unsubscribe();
}

export abstract class SubscriberBase implements ISubscriber {
    subscriptions: Subscription[];
    constructor() {
        this.subscriptions = [];
    }

    abstract subscribe();

    unsubscribe() {
        this.subscriptions.forEach( s => s.unsubscribe() );
    }
}
