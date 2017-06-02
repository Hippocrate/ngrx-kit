import { NgModule, ModuleWithProviders } from '@angular/core';
import { Effects, EffectsHandlerToken } from './Effects';
import { EffectsModule } from '@ngrx/effects';
import {
    SaveStateEffectHandler, IStateStorageToken, IStateStorage, LocalStateStorage,
    IPersistenceConfiguration, PersistenceConfiguration
} from './persistence';

export interface EffectsModuleConfig {
    handlers: any[];
    storage: IPersistenceConfiguration
}

@NgModule({
    imports: [EffectsModule],
})
export class SignatureEffectsModule {
    static run(config: EffectsModuleConfig) {
        return run(EffectsModule.run(Effects), config);
    }

    static runAfterBootstrap(config: EffectsModuleConfig) {
        return run(EffectsModule.runAfterBootstrap(Effects), config);
    } 
}

function run(moduleWithP: ModuleWithProviders, config: EffectsModuleConfig): ModuleWithProviders {
    if (!config.handlers) {
        console.warn('no handlers provided');
    }
    const handlers = config.handlers.filter( h => {
        return typeof h && h.prototype && typeof h.prototype.execute === 'function';
    });

    handlers.push(SaveStateEffectHandler);
    moduleWithP.providers.push(handlers, <any> {
        provide: EffectsHandlerToken,
        useValue: handlers
    });

    if (config.storage && config.storage.key ) {
        moduleWithP.providers.push({
            provide: IStateStorageToken,
            useValue: new LocalStateStorage(config.storage.key)
        }, {
            provide: PersistenceConfiguration,
            useValue: new PersistenceConfiguration(config.storage)
        });
    }

    return moduleWithP;
}