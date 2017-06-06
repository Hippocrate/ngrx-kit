import { Action } from '@ngrx/Store';

export interface ActionClass {
    new(payload: any): Action;
}
