import worker_name_provider from '../../shared/provide_name';

import {
    PromisedPostMessage,
    Maybe,
    ICustomWorkerPort,
    Transferable,
    isCustomPort,
    Dictionary,
    isWorker
} from '../../zorigami_types';

export class ProvideWorkerAPI {
    private worker_apis: Dictionary<Dictionary<PromisedPostMessage>>;

    constructor(){
        this.worker_apis = {};
    }

    public storeWorkerApi = (worker_name: string, worker_api_config: Array<string>) => {
        const new_worker_api = worker_api_config.reduce((acc: Dictionary<PromisedPostMessage>, action_type: string) => {
            const promised_api_caller = this.makeWorkerApiCall(worker_name, action_type);
            acc[action_type] = promised_api_caller;
            return acc;
        }, {})

        this.worker_apis[worker_name] = new_worker_api;
        console.warn('storeWorkerApi', this.worker_apis);
        return;
    }

    public getWorkerApi = (worker_name: string, action_name: string): Maybe<PromisedPostMessage> => {
        return this.worker_apis[worker_name][action_name];
    }

    private makeWorkerApiCall = (worker_name: string, action_type: string): PromisedPostMessage => {
        const return_func: PromisedPostMessage = (message: any, transferables?: Array<Transferable>) => {
            /* grab the worker port, or the worker itself and post a message to it */
            const worker_port: Maybe<ICustomWorkerPort> = this.getWorkerInterface(worker_name)
            if (isCustomPort(worker_port)) {
                return worker_port.postMessage({
                    type: action_type,
                    ...message,
                }, transferables);
            } else {
                throw new Error(`getWorkerApi makePortApiCall Inside ${worker_name_provider.getWorkerName()}, Worker Not found for ${action_type}, ${worker_name}`);
            }
        }
        return return_func;
    }
}