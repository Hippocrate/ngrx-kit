export interface IPersistenceConfiguration {
    key: string;
    autoSave?: boolean;
    autoSaveDebounce?: number;
}

export class PersistenceConfiguration {
    key: string;
    autoSave: boolean;
    autoSaveDebounce: number;
    constructor(config: IPersistenceConfiguration) {
        this.key = config.key;
        this.autoSave = !!config.autoSave;
        this.autoSaveDebounce = config.autoSaveDebounce === undefined ? 250 : config.autoSaveDebounce
    }
}
